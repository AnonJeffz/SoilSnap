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

  // MODEL FILES (14 shards + model.json)
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

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_STATIC && k !== CACHE_MODEL)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// MAIN FETCH HANDLER
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // TFJS MODEL FILES
  if (url.pathname.startsWith("/models/")) {
    event.respondWith(
      caches.open(CACHE_MODEL).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) return cached;

        const resp = await fetch(req);
        if (resp.ok) cache.put(req, resp.clone());

        return resp;
      })
    );
    return;
  }

  // Navigation → fallback to offline page
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("/offline.html"))
    );
    return;
  }

  // Static assets
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
