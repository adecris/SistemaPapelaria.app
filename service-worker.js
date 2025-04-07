
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open('papelaria-cache-v1').then(cache => {
      return cache.addAll(['/','/index.html','/manifest.json','/app.js']);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
