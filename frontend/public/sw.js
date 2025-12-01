const CACHE_NAME_STATIC = "soil-snap-static-v3";
const CACHE_NAME_RUNTIME = "soil-snap-runtime-v3";
const OFFLINE_PAGE = "/offline.html";
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  OFFLINE_PAGE,
  "/favicon.png",
  "/favicon.ico",
  "/fallback-crop.png"
];

// === OFFLINE DB HELPERS ===
function idbOpen() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("soil_snap_db", 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("pending"))
        db.createObjectStore("pending", { keyPath: "id", autoIncrement: true });
      if (!db.objectStoreNames.contains("data"))
        db.createObjectStore("data", { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getAllPendingSW() {
  const db = await idbOpen();
  return new Promise((res, rej) => {
    const tx = db.transaction("pending", "readonly");
    const store = tx.objectStore("pending");
    const req = store.getAll();
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}

async function deletePendingSW(id) {
  const db = await idbOpen();
  return new Promise((res, rej) => {
    const tx = db.transaction("pending", "readwrite");
    tx.objectStore("pending").delete(id);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}

async function processQueue() {
  const items = await getAllPendingSW();
  for (const item of items) {
    try {
      const op = item.op;
      const init = {
        method: op.method || "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(op.body || {})
      };
      const resp = await fetch(op.url, init);
      if (resp && resp.ok) {
        await deletePendingSW(item.id);
      } else {
        // server rejected: keep item (or add failure handling)
      }
    } catch (err) {
      // network error — stop processing now
      return;
    }
  }
}
// ...existing code...
// === BACKGROUND SYNC LISTENER ===
self.addEventListener("sync", (event) => {
  if (event.tag === "soil-snap-sync") {
    event.waitUntil(processQueue());
  }
});
// === MESSAGE HANDLER ===
self.addEventListener("message", (evt) => {
  if (evt.data && evt.data.type === "PROCESS_QUEUE") {
    evt.waitUntil(processQueue());
  }
});

// Install basic app shell
async function broadcastMessage(msg) {
  const all = await self.clients.matchAll({ includeUncontrolled: true });
  for (const client of all) {
    client.postMessage(msg);
  }
}

// resilient installer with progress messages
// ...existing code...
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME_STATIC);
    await cache.addAll(APP_SHELL);

    // --- SEED RECOMMENDATIONS FOR OFFLINE USE (LOGGING, ABSOLUTE URL) ---
    const soils = [
      "Clay","Loam","Loamy Sand","Sand","Sandy Clay Loam","Sandy Loam","Silt","Silty Clay","Silty Loam"
    ];

    async function seedRecommendations() {
      console.log("SW: start seeding recommendations");
      try {
        const db = await idbOpen();
        for (const soil of soils) {
          try {
            const url = "https://soilsnap.up.railway.app/api/crop/recommendation"; // absolute URL
            console.log("SW: fetching recommendation for", soil);
            const res = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              // NOTE: remove credentials here — SW cross-origin credentials often blocked
              body: JSON.stringify({ soil }),
            });
            console.log("SW: fetch status for", soil, res.status);
            if (!res.ok) {
              const text = await res.text().catch(()=>"<no body>");
              console.warn("SW: Seed fetch failed for", soil, res.status, text);
              continue;
            }
            const json = await res.json();
            const recs = json.recommendations || [];

            await new Promise((resolve, reject) => {
              const tx = db.transaction("data", "readwrite");
              const store = tx.objectStore("data");
              store.put({ id: `crop-rec-${soil}`, soil, recommendations: recs });
              tx.oncomplete = () => resolve();
              tx.onerror = () => reject(tx.error);
            });
            console.log("SW: Seeded recommendations for", soil);
          } catch (e) {
            console.warn("SW: Seed error for", soil, e);
          }
        }
      } catch (e) {
        console.warn("SW: IDB open failed during seeding", e);
      }
    }

    try {
      await seedRecommendations();
    } catch (e) {
      console.warn("SW: Seeding recommendations failed", e);
    }
    // --- end seeding ---
  })());
  self.skipWaiting();
});

// report progress while processing pending queue
async function processQueue() {
  const items = await getAllPendingSW();
  await broadcastMessage({ type: "SW_SYNC_START", total: items.length });
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    try {
      const op = item.op;
      const init = {
        method: op.method || "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(op.body || {})
      };
      const resp = await fetch(op.url, init);
      if (resp && resp.ok) {
        await deletePendingSW(item.id);
        await broadcastMessage({ type: "SW_SYNC_PROGRESS", index: i + 1, total: items.length, id: item.id, ok: true });
      } else {
        await broadcastMessage({ type: "SW_SYNC_PROGRESS", index: i + 1, total: items.length, id: item.id, ok: false, status: resp && resp.status });
      }
    } catch (err) {
      // network error — inform clients and stop processing
      await broadcastMessage({ type: "SW_SYNC_ERROR", index: i + 1, total: items.length, err: String(err) });
      return;
    }
  }
  await broadcastMessage({ type: "SW_SYNC_DONE" });
}

// Clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME_STATIC && k !== CACHE_NAME_RUNTIME)
          .map((oldKey) => caches.delete(oldKey))
      )
    )
  );
  self.clients.claim();
});

// ...existing code...

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = req.url;

  // don't interfere with dev model files, binary assets or sockets
  if (
    url.includes("/models/") ||
    url.endsWith(".bin") ||
    url.endsWith(".wasm") ||
    url.endsWith(".map")
  ) {
    return; 
  }

   if (url.includes("/uploads/crops/") || url.includes("/uploads/crops")) {
    return event.respondWith((async () => {
      try {
        const cache = await caches.open("soil-snap-images-v1");
        // try cache first
        const cached = await cache.match(req);
        if (cached) return cached;

        // then network and store to cache for future offline use
        const response = await fetch(req);
        if (response && response.ok) {
          try { await cache.put(req, response.clone()); } catch (e) { /* ignore cache.put errors */ }
        }
        return response;
      } catch (err) {
        // if both cache and network fail, return a 503 null response to avoid throwing
        return new Response(null, { status: 503, statusText: "offline" });
      }
    })());
  }

  // API/auth/uploads: network-first with offline JSON fallback
  if (url.includes("/api/") || url.includes("/auth/") || url.includes("/uploads/") || url.includes("/socket/")) {
    return event.respondWith(
      fetch(req).catch(async () => {
        // if it's an API JSON request, return a JSON failure response instead of HTML
        const accept = req.headers.get("Accept") || "";
        if (accept.includes("application/json") || req.headers.get("Content-Type")?.includes("application/json")) {
          return new Response(JSON.stringify({ error: "offline" }), {
            status: 503,
            headers: { "Content-Type": "application/json" }
          });
        }
        // otherwise try cache fallback or offline page
        const cached = await caches.match(req);
        return cached || caches.match(OFFLINE_PAGE);
      })
    );
  }

  // navigation requests (SPA) — network-first, fallback to index.html or offline page
  if (req.mode === "navigate") {
    return event.respondWith(
      fetch(req)
        .then((resp) => {
          if (resp && resp.ok) {
            caches.open(CACHE_NAME_RUNTIME).then((cache) => { try { cache.put(req, resp.clone()); } catch {} });
          }
          return resp;
        })
        .catch(() => caches.match("/index.html").then(r => r || caches.match(OFFLINE_PAGE)))
    );
  }

  // static assets: try cache-first but ensure we return same-type responses
  const staticAssetRegex = /\.(?:js|css|png|jpg|jpeg|svg|ico|webp|woff2?)$/i;
  if (staticAssetRegex.test(url)) {
    return event.respondWith(
      caches.match(req).then(async (cached) => {
        if (cached) return cached;
        try {
          const resp = await fetch(req);
          if (resp && resp.ok) {
            caches.open(CACHE_NAME_STATIC).then((cache) => { try { cache.put(req, resp.clone()); } catch {} });
          }
          return resp;
        } catch {
          // no cache and network failed -> return offline page only for navigations,
          // for other assets return a 503 empty response to avoid wrong MIME types
          return new Response(null, { status: 503, statusText: "offline" });
        }
      })
    );
  }

  // default: network-first with safe cache fallback
  return event.respondWith(
    fetch(req)
      .then((resp) => {
        if (resp && resp.ok) {
          caches.open(CACHE_NAME_RUNTIME).then((cache) => { try { cache.put(req, resp.clone()); } catch {} });
        }
        return resp;
      })
      .catch(async () => {
        const cached = await caches.match(req);
        if (!cached) {
          // special-case manifest.json -> return minimal JSON manifest so browser doesn't get HTML
          if (url.endsWith("/manifest.json")) {
            const minimal = {
              name: "SoilSnap",
              short_name: "SoilSnap",
              start_url: "/",
              display: "standalone"
            };
            return new Response(JSON.stringify(minimal), { headers: { "Content-Type": "application/json" } });
          }
          // otherwise return offline page only for navigation; other types -> 503
          if (req.headers.get("Accept")?.includes("text/html") || req.mode === "navigate") {
            return caches.match(OFFLINE_PAGE);
          }
          return new Response(null, { status: 503, statusText: "offline" });
        }
        // ensure we don't serve HTML for a JS/JSON request
        const ct = cached.headers.get("Content-Type") || "";
        if (ct.includes("text/html") && req.mode !== "navigate") {
          return new Response(null, { status: 503, statusText: "wrong content-type fallback" });
        }
        return cached;
      })
  );
});