const VERSION = 6.1;

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

self.addEventListener('activate', event => {
  event.waitUntil(new Promise(resolve => setTimeout(resolve, 10 * 1000)).then(() => console.log('Activate done')));
});
