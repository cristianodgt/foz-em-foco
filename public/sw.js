/* Foz em Foco — Service Worker
 * Strategy:
 *  - HTML navigations: NetworkFirst, fall back to offline page
 *  - /api/*:          NetworkFirst with 5s timeout, short TTL
 *  - images:          CacheFirst
 *  - fonts:           CacheFirst
 *  - static assets:   StaleWhileRevalidate
 */

const VERSION = 'fef-v1';
const PRECACHE = `${VERSION}-precache`;
const RUNTIME_PAGES = `${VERSION}-pages`;
const RUNTIME_API = `${VERSION}-api`;
const RUNTIME_IMG = `${VERSION}-img`;
const RUNTIME_FONT = `${VERSION}-font`;
const RUNTIME_STATIC = `${VERSION}-static`;

const OFFLINE_URL = '/offline';
const PRECACHE_URLS = [OFFLINE_URL, '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

function timedFetch(request, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    fetch(request).then((r) => { clearTimeout(t); resolve(r); }, (e) => { clearTimeout(t); reject(e); });
  });
}

async function networkFirst(request, cacheName, timeoutMs) {
  const cache = await caches.open(cacheName);
  try {
    const res = await (timeoutMs ? timedFetch(request, timeoutMs) : fetch(request));
    if (res && res.ok) cache.put(request, res.clone());
    return res;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw new Error('offline');
  }
}

async function cacheFirst(request, cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const res = await fetch(request);
  if (res && res.ok) {
    cache.put(request, res.clone());
    if (maxEntries) trimCache(cacheName, maxEntries);
  }
  return res;
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request).then((res) => {
    if (res && res.ok) cache.put(request, res.clone());
    return res;
  }).catch(() => cached);
  return cached || network;
}

async function trimCache(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > max) {
    for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // Never cache admin or auth routes
  if (sameOrigin && (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/auth') || url.pathname.startsWith('/login'))) {
    return;
  }

  // HTML navigations
  if (req.mode === 'navigate') {
    event.respondWith(
      networkFirst(req, RUNTIME_PAGES, 4000).catch(async () => {
        const cache = await caches.open(PRECACHE);
        return (await cache.match(OFFLINE_URL)) || new Response('Offline', { status: 503 });
      })
    );
    return;
  }

  // API
  if (sameOrigin && url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(req, RUNTIME_API, 5000).catch(() => new Response('[]', { headers: { 'Content-Type': 'application/json' } })));
    return;
  }

  // Google Fonts
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(req, RUNTIME_FONT, 30));
    return;
  }

  // Images
  if (req.destination === 'image' || /\.(png|jpg|jpeg|svg|gif|webp|ico)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(req, RUNTIME_IMG, 100));
    return;
  }

  // Static: JS/CSS/Next static
  if (sameOrigin && (url.pathname.startsWith('/_next/static') || /\.(js|css|woff2?)$/i.test(url.pathname))) {
    event.respondWith(staleWhileRevalidate(req, RUNTIME_STATIC));
    return;
  }
});
