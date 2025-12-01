/* ============================================================
   SoilSnap Service Worker – Offline ML + Offline DB
   ============================================================ */

const STATIC_CACHE = "ss-static-v1";
const RUNTIME_CACHE = "ss-runtime-v1";
const MODEL_CACHE = "ss-model-v1";

const APP_SHELL = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.json",
  "/idb.js",
];

/* ML MODEL FILES */
const MODEL_FILES = [
  "/models/model.json",
  "/models/group1-shard1of14.bin",
  "/models/group1-shard2of14.bin",
  "/models/group1-shard3of14.bin",
  "/models/group1-shard4of14.bin",
  "/models/group1-shard5of14.bin",
  "/models/group1-shard6of14.bin",
  "/models/group1-shard7of14.bin",
  "/models/group1-shard8of14.bin",
  "/models/group1-shard9of14.bin",
  "/models/group1-shard10of14.bin",
  "/models/group1-shard11of14.bin",
  "/models/group1-shard12of14.bin",
  "/models/group1-shard13of14.bin",
  "/models/group1-shard14of14.bin"
];

/* ============================================================
   INSTALL – Cache Shell + ML Model
   ============================================================ */
self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const staticCache = await caches.open(STATIC_CACHE);
    await staticCache.addAll(APP_SHELL);

    const modelCache = await caches.open(MODEL_CACHE);
    await modelCache.addAll(MODEL_FILES);
  })());

  self.skipWaiting();
});

/* ============================================================
   ACTIVATE – Clean Old Caches
   ============================================================ */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k =>
            ![STATIC_CACHE, RUNTIME_CACHE, MODEL_CACHE].includes(k)
          )
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* ============================================================
   LOAD idb.js INSIDE SW
   ============================================================ */
importScripts("/idb.js");

/* ============================================================
   FETCH HANDLER
   ============================================================ */
self.addEventListener("fetch", event => {
  const req = event.request;
  const url = req.url;

  /* ========== ML MODEL FILES ========== */
  if (url.includes("/models/")) {
    return event.respondWith(
      caches.open(MODEL_CACHE).then(async cache => {
        const cached = await cache.match(req);
        if (cached) return cached;

        const resp = await fetch(req);
        if (resp.ok) cache.put(req, resp.clone());
        return resp;
      })
    );
  }

  /* ========== API (Recommendations) ========== */
  if (url.includes("/api/soil/recommendation")) {
    return event.respondWith((async () => {
      try {
        // Try online first
        const resp = await fetch(req);
        const clone = resp.clone();

        // Save to IDB
        clone.json().then(data => {
          saveRecommendation(data.soilType, data);
        });

        return resp;
      } catch (e) {
        // Offline fallback → load from IDB
        const soilType = new URL(url).searchParams.get("soil");
        const offlineData = await getRecommendation(soilType);

        if (offlineData) {
          return new Response(JSON.stringify(offlineData), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }

        return new Response(JSON.stringify({ error: "offline" }), {
          status: 503
        });
      }
    })());
  }

  /* ========== Uploads (Dynamic Images) ========== */
  if (url.includes("/uploads/")) {
    return event.respondWith(
      fetch(req).catch(() => new Response(null, { status: 503 }))
    );
  }

  /* ========== Navigation fallback ========== */
  if (req.mode === "navigate") {
    return event.respondWith(
      fetch(req).catch(() => caches.match("/index.html"))
    );
  }

  /* ========== Static assets ========== */
  return event.respondWith(
    caches.match(req).then(async cached => {
      if (cached) return cached;

      try {
        const resp = await fetch(req);
        caches.open(RUNTIME_CACHE).then(cache =>
          cache.put(req, resp.clone())
        );
        return resp;
      } catch {
        return caches.match("/offline.html");
      }
    })
  );
});
