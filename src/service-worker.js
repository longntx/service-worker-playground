const VERSION = 6.5;

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

self.addEventListener('activate', (event) => {
  event.waitUntil(async function() {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.filter((cacheName) => {
        // Return true if you want to remove this cache,
        // but remember that caches are shared across
        // the whole origin
      }).map(cacheName => caches.delete(cacheName))
    );
  }());
});
