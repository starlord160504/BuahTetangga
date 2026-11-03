// Cache cangkang aplikasi supaya terbuka instan & tetap tampil saat sinyal lemah.
// Permintaan ke Apps Script (POST) tidak pernah di-cache.
const C = 'bt-v9', SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.hostname.includes('script.google') || u.hostname.includes('googleusercontent')) return; // logo dimuat langsung (perlu CORS untuk recipt)
  if (u.origin === location.origin) { // file aplikasi: jaringan dulu, cache jika offline
    e.respondWith(fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); } return res; }).catch(() => caches.match(r)));
    return;
  }
  e.respondWith(caches.match(r).then(hit => {
    const net = fetch(r).then(res => { if (res && (res.ok || res.type === 'opaque')) { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); } return res; }).catch(() => hit);
    return hit || net;
  }));
});
