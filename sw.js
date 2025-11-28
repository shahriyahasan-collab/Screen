// Minimal Service Worker to enable PWA "Install App" feature
const CACHE_NAME = 'vibecheck-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass through all requests to network
  // This ensures the app works in dev environments without stale cache issues
  event.respondWith(fetch(event.request));
});