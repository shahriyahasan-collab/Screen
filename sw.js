// Service Worker for PWA support
const CACHE_NAME = 'vibecheck-v2';
const urlsToCache = [
  './',
  './index.html',
  './index.tsx',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((err) => console.log('Cache install failed', err))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found, otherwise fetch from network
      return response || fetch(event.request).catch(() => {
        // Fallback or error handling could go here
        // For now, if both fail, we just let it fail
      });
    })
  );
});