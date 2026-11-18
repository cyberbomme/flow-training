// Offline-Cache. Strategie: Netz zuerst (mit kurzer Wartezeit), sonst Cache.
// So kommt bei Verbindung immer die aktuelle Version, offline läuft die App trotzdem.
importScripts('js/version.js');
const CACHE = 'flow-training-' + self.APP_VERSION;
const NET_TIMEOUT = 3000; // ms – danach aus dem Cache, damit schlechtes Studio-WLAN nicht blockiert
const SHELL = [
  './', 'index.html', 'app.css', 'manifest.webmanifest',
  'js/app.js', 'js/planedit.js', 'js/version.js', 'js/exercises.js', 'js/figure.js', 'js/store.js', 'js/timer.js',
  'icons/icon.svg', 'fonts/oswald-var.woff2', 'fonts/montserrat-var.woff2', 'fonts/gilda-display-400.woff2', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png',
];

self.addEventListener('install', (e) => {
  // cache: 'reload' umgeht den HTTP-Cache von GitHub Pages (10 min), sonst landen alte Dateien im neuen Cache
  e.waitUntil(caches.open(CACHE)
    .then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    const net = fetch(e.request, { cache: 'no-cache' }).then((r) => { if (r.ok) c.put(e.request, r.clone()); return r; });
    const timeout = new Promise((res) => setTimeout(res, NET_TIMEOUT));
    try {
      const r = await Promise.race([net, timeout]);
      if (r) return r;
    } catch {}
    const hit = await c.match(e.request, { ignoreSearch: true });
    return hit || net;
  })());
});
