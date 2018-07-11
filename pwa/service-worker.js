var self = this;
self.addEventListener('install', (event) => {
  self.skipWaiting();
  if ('caches' in self) {
    event.waitUntil(
      caches.open('v1').then((cache) => {
        return cache.addAll([
          './index.html',
          './script.js',
          './banner-bg.svg'
        ]);
      })
    );
  }
  console.log('Update service worker installed', event);
});

self.addEventListener('activate', (event) => {
  console.log('Update service worker activated', event);
});

// 以下是新增的内容
self.addEventListener('fetch', (event) => {
  //event.respondWith(new Response('My name is semlinker!'));
  // event.respondWith(
  //   caches.match(event.request)
  // );
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((response) => {
        return caches.open('v1').then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );

});