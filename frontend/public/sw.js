/* ------------------------------
   SoilSnap Service Worker (Offline + TFJS Model)
--------------------------------*/

const CACHE_STATIC = "soil-snap-static-v4";
const CACHE_MODEL = "soil-snap-model-v1";
const OFFLINE_PAGE = "/offline.html";

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/offline.html",
  "/favicon.png",
  "/favicon.ico",
  "/fallback-crop.png",

  // MODEL FILES
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
  "/models/group1-shard14of14.bin",
];

/* ------------------------------
   INSTALL: cache static + model files
--------------------------------*/
self.addEventListener("install", (event) => {
  console.log("[SW] Installing…");

  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => {
      console.log("[SW] Precaching App Shell");
      return cache.addAll(APP_SHELL);
    })
  );

  self.skipWaiting();
});

/* ------------------------------
   ACTIVATE: cleanup old caches
--------------------------------*/
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating…");

  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_STATIC && key !== CACHE_MODEL)
          .map((key) => {
            console.log("[SW] Deleting old cache:", key);
            return caches.delete(key);
          })
      )
    )
  );

  self.clients.claim();
});

/* ------------------------------
   FETCH HANDLER
--------------------------------*/
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  /* ------------------------------
     1. Handle TensorFlow Model Files
  --------------------------------*/
  if (url.pathname.startsWith("/models/")) {
    event.respondWith(
      caches.open(CACHE_MODEL).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) return cached;

        try {
          const resp = await fetch(req);
          if (resp.ok) {
            cache.put(req, resp.clone());
          }
          return resp;
        } catch (err) {
          console.warn("[SW] Model fetch failed, offline?", err);
          return cached || new Response(null, { status: 503 });
        }
      })
    );
    return;
  }

  /* ------------------------------
     2. Navigation requests → offline page
  --------------------------------*/
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match(OFFLINE_PAGE))
    );
    return;
  }

  /* ------------------------------
     3. Static assets: cache-first
  --------------------------------*/
  event.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req)
          .then((resp) => {
            if (resp.ok) {
              caches.open(CACHE_STATIC).then((cache) =>
                cache.put(req, resp.clone())
              );
            }
            return resp;
          })
          .catch(() => cached)
    )
  );
});
