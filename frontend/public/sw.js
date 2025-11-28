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

// === Broadcast Messages to Clients ===
async function broadcastMessage(msg) {
  const all = await self.clients.matchAll({ includeUncontrolled: true });
  for (const client of all) {
    client.postMessage(msg);
  }
}

// === Process Pending Queue ===
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
      await broadcastMessage({ type: "SW_SYNC_ERROR", index: i + 1, total: items.length, err: String(err) });
      return;
    }
  }
  await broadcastMessage({ type: "SW_SYNC_DONE" });
}

// === Seed Recommendations in Background ===
async function seedRecommendationsInBackground() {
  const soils = ["Clay","Loam","Loamy Sand","Sand","Sandy Clay Loam","Sandy Loam","Silt","Silty Clay","Silty Loam"];
  const db = await idbOpen();

  for (const soil of soils) {
    const exists = await new Promise(res => {
      const tx = db.transaction("data","readonly");
      tx.objectStore("data").get(`crop-rec-${soil}`).onsuccess = e => res(!!e.target.result);
    });
    if (!exists) {
      try {
        const res = await fetch("https://soilsnap-production.up.railway.app/api/crop/recommendation", {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({ soil }),
        });
        if (res.ok) {
          const json = await res.json();
          const tx = db.transaction("data","readwrite");
          tx.objectStore("data").put({ id: `crop-rec-${soil}`, soil, recommendations: json.recommendations || [] });
          await broadcastMessage({ type: "SOIL_PREFETCH_PROGRESS", soil });
        }
      } catch(e) {
        console.warn("SW seed failed for", soil, e);
      }
    }
  }

  await broadcastMessage({ type: "SOIL_PREFETCH_DONE" });
}

// === Install Event ===
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME_STATIC);
    await cache.addAll(APP_SHELL);
    self.skipWaiting();
  })());
});

// === Activate Event ===
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(k => ![CACHE_NAME_STATIC, CACHE_NAME_RUNTIME, CACHE_NAME_IMAGES].includes(k))
      .map(oldKey => caches.delete(oldKey))
    );

    if ('sync' in self.registration) {
      await self.registration.sync.register('soil-snap-seed');
    } else {
      seedRecommendationsInBackground();
    }

    self.clients.claim();
  })());
});

// === Background Sync Listener ===
self.addEventListener("sync", (event) => {
  if (event.tag === "soil-snap-sync") event.waitUntil(processQueue());
  if (event.tag === "soil-snap-seed") event.waitUntil(seedRecommendationsInBackground());
});

// === Message Handler ===
self.addEventListener("message", (evt) => {
  if (evt.data && evt.data.type === "PROCESS_QUEUE") {
    evt.waitUntil(processQueue());
  }
});

// === Fetch Event ===
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // --- EXCLUDE API verification route ---
  if (url.pathname.startsWith("/api/users/verify")) return;

  // Skip large models
  if (url.pathname.includes("/models/") || url.pathname.endsWith(".bin") || url.pathname.endsWith(".wasm") || url.pathname.endsWith(".map")) return;

  // Images cache-first
  if (url.pathname.startsWith("/uploads/crops")) {
    event.respondWith(cacheFirst(req, CACHE_NAME_IMAGES));
    return;
  }

  // API network-first
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth/") || url.pathname.startsWith("/uploads/") || url.pathname.startsWith("/socket/")) {
    event.respondWith(networkFirst(req));
    return;
  }

  // SPA navigation
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then(resp => {
          if (resp && resp.ok) caches.open(CACHE_NAME_RUNTIME).then(c => c.put(req, resp.clone()));
          return resp;
        })
        .catch(() => caches.match("/index.html").then(r => r || caches.match(OFFLINE_PAGE)))
    );
    return;
  }

  // Static assets cache-first
  if (/\.(?:js|css|png|jpg|jpeg|svg|ico|webp|woff2?)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(req, CACHE_NAME_STATIC));
    return;
  }

  // Default network-first fallback
  event.respondWith(networkFirst(req));
});

// --- Helper Functions ---
async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached) return cached;
  const resp = await fetch(req);
  if (resp && resp.ok) await cache.put(req, resp.clone());
  return resp;
}

async function networkFirst(req) {
  try {
    const resp = await fetch(req);
    if (resp && resp.ok) caches.open(CACHE_NAME_RUNTIME).then(c => c.put(req, resp.clone()));
    return resp;
  } catch {
    const cached = await caches.match(req);
    if (cached) return cached;
    return new Response(null, { status: 503, statusText: "offline" });
  }
}
