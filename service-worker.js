const CACHE_NAME = "revision-randomiser-cache-v1";
const urlsToCache = [
  "index.html",
  "styles.css",
  "script.js",
  "manifest.json",
  "cards_data.json",
  "icons/icon-192x192.png",
  "icons/icon-512x512.png"
];

// Install the service worker and cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch resources from cache when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Update cache on activation
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});
