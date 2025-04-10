const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];

const self = this;

// Install SW
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((err) => console.log(err))
  );
});

// Listen for requests
self.addEventListener("fetch", (event) => {
  const requestUrl = event.request.url;

  // Bypass API requests
  if (requestUrl.includes("/api/") || event.request.method !== "GET") {
    event.respondWith(
      fetch(event.request).catch((error) => {
        // Log the error but don’t fallback to offline.html for API requests
        console.error("Fetch failed for API request:", error);
        throw error; // Let the app handle the error (e.g., 401)
      })
    );
    return;
  }

  // Handle static assets or HTML requests
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).catch(() => caches.match("offline.html"))
      );
    })
  );
});

// Activate the SW
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});