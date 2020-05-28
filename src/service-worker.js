const VERSION = 6.6;

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

workbox.setConfig({ debug: false, skipWaiting: false, clientsClaim: true });

workbox.routing.registerRoute(
  new RegExp('\\.(?:html|js|json)$'),
  new workbox.strategies.CacheFirst({
    cacheName: `${VERSION}`,
    plugins: [
      new workbox.expiration.ExpirationPlugin({ maxAgeSeconds: 86400 * 7 * 30, purgeOnQuotaError: false }),
      new workbox.broadcastUpdate.BroadcastUpdatePlugin('update-myCache')
    ]
  }),
  'GET'
);

self.addEventListener('message', event => {
  if (!event.data) {
    return;
  }
  switch (event.data) {
    case 'skipWaiting':
      self.skipWaiting();
      break;
    default:
      // NOOP
      break;
  }
});

self.addEventListener('activate', event => event.waitUntil(
  caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames
        .filter(cacheName => true)
        .map(cacheName => {
          return caches.delete(cacheName);
        })
    )
      .then(() => self.clients.claim())
      .catch(() => console.log('error'));
  })
));
