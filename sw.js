// Offline-Cache: stale-while-revalidate – Updates erscheinen beim nächsten Öffnen.
importScripts('js/version.js');
const CACHE = 'flow-training-' + self.APP_VERSION;
const SHELL = [
  './', 'index.html', 'app.css', 'manifest.webmanifest',
  'js/app.js', 'js/version.js', 'js/exercises.js', 'js/figure.js', 'js/store.js', 'js/timer.js',
  'icons/icon.svg', 'fonts/oswald-var.woff2', 'fonts/montserrat-var.woff2', 'fonts/gilda-display-400.woff2', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async (c) => {
    const hit = await c.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then((r) => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
