/* HSM E&A web app – keeps the app files on the phone so it opens and works with no network.
 * Data (Supabase) is never cached here; the app keeps its own offline copy. */
const CACHE = 'hsm-ea-__BUILD__';
const FILES = ['./', 'index.html', 'boot.js', 'app.js', 'xlreport.js', 'app.css', 'lib/exceljs.min.js', 'manifest.webmanifest',
  'xl/CB.xlsx', 'xl/COILER.xlsx', 'xl/FM.xlsx', 'xl/RMRHF.xlsx', 'icons/apple-touch-icon.png', 'icons/icon-192.png',
  'fonts/barlow-latin-400-normal.woff2', 'fonts/barlow-latin-500-normal.woff2', 'fonts/barlow-latin-600-normal.woff2',
  'fonts/barlow-latin-700-normal.woff2', 'fonts/barlow-semi-condensed-latin-700-normal.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;       // cloud data: straight to network
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: true }) || (e.request.mode === 'navigate' ? await c.match('index.html') : null);
    const net = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => null);
    return hit || (await net) || new Response('Offline', { status: 503 });
  }));
});
