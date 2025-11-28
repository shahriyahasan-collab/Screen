// Service Worker for PWA support
const CACHE_NAME = 'vibecheck-v3';
// We only cache the root and critical assets. 
// We remove explicit './index.html' to avoid 404s if the server serves root only.
const urlsToCache = [
  './',
  './index.tsx',
  './manifest.json'
];

self.addEventListener('install', (event) => {
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
  // Navigation fallback: If the user navigates to the app (e.g. opening it),
  // serve the cached root content (index.html) even if they ask for something specific.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('./').then((response) => {
        return response || fetch(event.request);
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});