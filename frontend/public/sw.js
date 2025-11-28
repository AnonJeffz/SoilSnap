const CACHE_NAME_STATIC = "soil-snap-static-v3";
const CACHE_NAME_RUNTIME = "soil-snap-runtime-v3";
const CACHE_NAME_IMAGES = "soil-snap-images-v1";
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

// === IndexedDB Helpers ===
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
    tx.objectStore("pending").getAll().onsuccess = (e) => res(e.target.result);
    tx.onerror = () => rej(tx.error);
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

async function broadcastMessage(msg) {
  const all = await self.clients.matchAll({ includeUncontrolled: true });
  all.forEach((client) => client.postMessage(msg));
}

async function processQueue() {
  const items = await getAllPendingSW();
  await broadcastMessage({ type: "SW_SYNC_START", total: items.length });

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    try {
      const res = await fetch(item.op.url, {
        method: item.op.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item.op.body)
      });

      if (res.ok) await deletePendingSW(item.id);

      await broadcastMessage({
        type: "SW_SYNC_PROGRESS",
        index: i + 1,
        total: items.length,
        id: item.id,
        ok: res.ok
      });

    } catch (err) {
      await broadcastMessage({
        type: "SW_SYNC_ERROR",
        index: i + 1,
        total: items.length,
        err: String(err)
      });
      return;
    }
  }

  await broadcastMessage({ type: "SW_SYNC_DONE" });
}

async function seedRecommendationsInBackground() {
  const soils = [
    "Clay", "Loam", "Loamy Sand", "Sand", "Sandy Clay Loam", 
    "Sandy Loam", "Silt", "Silty Clay", "Silty Loam"
  ];

  const db = await idbOpen();

  for (const soil of soils) {
    const exists = await new Promise((res) => {
      const tx = db.transaction("data", "readonly");
      tx.objectStore("data").get(`crop-rec-${soil}`).onsuccess = (e) =>
        res(!!e.target.result);
    });

    if (!exists) {
      try {
        const res = await fetch(
          "https://soilsnap-production.up.railway.app/api/crop/recommendation",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ soil })
          }
        );

        if (res.ok) {
          const json = await res.json();
          const tx = db.transaction("data", "readwrite");
          tx.objectStore("data").put({
            id: `crop-rec-${soil}`,
            soil,
            recommendations: json.recommendations || []
          });
          await broadcastMessage({ type: "SOIL_PREFETCH_PROGRESS", soil });
        }
      } catch (e) {}
    }
  }

  await broadcastMessage({ type: "SOIL_PREFETCH_DONE" });
}

// === Install ===
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME_STATIC).then((c) => c.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// === Activate ===
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(
            (k) =>
              ![CACHE_NAME_STATIC, CACHE_NAME_RUNTIME, CACHE_NAME_IMAGES].includes(
                k
              )
          )
          .map((oldKey) => caches.delete(oldKey))
      );

      if ("sync" in self.registration)
        await self.registration.sync.register("soil-snap-seed");
      else seedRecommendationsInBackground();

      self.clients.claim();
    })()
  );
});

// === Sync Listener ===
self.addEventListener("sync", (event) => {
  if (event.tag === "soil-snap-sync") event.waitUntil(processQueue());
  if (event.tag === "soil-snap-seed") event.waitUntil(seedRecommendationsInBackground());
});

// === Message Listener ===
self.addEventListener("message", (evt) => {
  if (evt.data?.type === "PROCESS_QUEUE") evt.waitUntil(processQueue());
});

// ==========================================
//     FETCH EVENT — FIXED VERSION
// ==========================================
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = req.url;

  // 🚨 *** IMPORTANT FIX ***
  // Make email verification bypass the Service Worker completely
  if (url.includes("/api/users/verify/")) {
    return event.respondWith(fetch(req));
  }

  // Ignore unnecessary files
  if (
    url.includes("/models/") ||
    url.endsWith(".bin") ||
    url.endsWith(".wasm") ||
    url.endsWith(".map")
  )
    return;

  // Images - cache-first
  if (url.includes("/uploads/crops/")) {
    return event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME_IMAGES);
        const cached = await cache.match(req);
        if (cached) return cached;

        try {
          const resp = await fetch(req);
          if (resp.ok) cache.put(req, resp.clone());
          return resp;
        } catch {
          return new Response(null, { status: 503 });
        }
      })()
    );
  }

  // API - network-first
  if (url.includes("/api/") || url.includes("/auth/")) {
    return event.respondWith(
      fetch(req).catch(() =>
        new Response(JSON.stringify({ error: "offline" }), {
          status: 503,
          headers: { "Content-Type": "application/json" }
        })
      )
    );
  }

  // SPA navigation fallback
  if (req.mode === "navigate") {
    return event.respondWith(
      fetch(req)
        .then((resp) => {
          if (resp.ok)
            caches.open(CACHE_NAME_RUNTIME).then((c) =>
              c.put(req, resp.clone())
            );
          return resp;
        })
        .catch(() => caches.match("/index.html"))
    );
  }

  // Static assets - cache-first
  const staticRegex = /\.(js|css|png|jpg|jpeg|svg|ico|webp|woff2?)$/i;
  if (staticRegex.test(url)) {
    return event.respondWith(
      caches.match(req).then(async (cached) => {
        if (cached) return cached;
        try {
          const resp = await fetch(req);
          if (resp.ok)
            caches.open(CACHE_NAME_STATIC).then((c) => c.put(req, resp.clone()));
          return resp;
        } catch {
          return new Response(null, { status: 503 });
        }
      })
    );
  }

  // Default: network-first
  return event.respondWith(
    fetch(req).catch(() => caches.match(req) || new Response(null, { status: 503 }))
  );
});
