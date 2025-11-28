const CACHE_STATIC = "soil-snap-static-v1";
const CACHE_DYNAMIC = "soil-snap-dynamic-v1";
const OFFLINE_PAGE = "/offline.html";

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.png",
  "/offline.html"
];

// ================================
// INSTALL – Cache App Shell
// ================================
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// ================================
// ACTIVATE – Remove Old Caches
// ================================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_STATIC && key !== CACHE_DYNAMIC)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ================================
// FETCH – Offline + Runtime Cache
// ================================
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // -----------------------------
  // 1. API → network first
  // -----------------------------
  if (req.url.includes("/api/")) {
    return event.respondWith(
      fetch(req).catch(() =>
        new Response(
          JSON.stringify({ error: "offline" }),
          { status: 503, headers: { "Content-Type": "application/json" } }
        )
      )
    );
  }

  // -----------------------------
  // 2. For navigation → offline page
  // -----------------------------
  if (req.mode === "navigate") {
    return event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) return res;
          return caches.match(OFFLINE_PAGE);
        })
        .catch(() => caches.match(OFFLINE_PAGE))
    );
  }

  // -----------------------------
  // 3. Static assets → cache first
  // -----------------------------
  if (/\.(js|css|png|jpg|jpeg|svg|webp|woff2?)$/i.test(req.url)) {
    return event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;

        return fetch(req)
          .then((res) => {
            return caches.open(CACHE_DYNAMIC).then((cache) => {
              cache.put(req, res.clone());
              return res;
            });
          })
          .catch(() => cached);
      })
    );
  }

  // -----------------------------
  // 4. Default: network first fallback cache
  // -----------------------------
  return event.respondWith(
    fetch(req)
      .then((res) => {
        caches.open(CACHE_DYNAMIC).then((cache) =>
          cache.put(req, res.clone())
        );
        return res;
      })
      .catch(() => caches.match(req))
  );
});
