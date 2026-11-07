/* global __FILES__ */
/* Service worker TraceTaRoute : app disponible hors connexion.
   Généré au build par app/vite-plugin-sw.ts (la liste des fichiers remplace __FILES__). */
const CACHE = 'ttr-5ede26365a88';
const FILES = ["./","apple-touch-icon.png","assets/atkinson-hyperlegible-latin-400-normal-BrHNak5F.woff2","assets/atkinson-hyperlegible-latin-700-normal-GZI4o3u0.woff2","assets/baloo-2-latin-700-normal-CqTg7A15.woff2","assets/baloo-2-latin-800-normal-BbF3Etk1.woff2","assets/index-CSRFYO7Y.css","assets/index-DJhTyXc_.js","favicon.svg","icon-192.png","icon-512.png","icon-maskable-512.png","manifest.webmanifest"];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(FILES.map((f) => new URL(f, self.registration.scope).href)))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('ttr-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  // l'API (étape 3) et les autres sites ne passent jamais par le cache
  if (req.method !== 'GET' || url.origin !== self.location.origin || url.pathname.includes('/api/')) return;
  if (req.mode === 'navigate') {
    // page : réseau d'abord (dernière version), sinon la copie hors connexion
    const index = new URL('./', self.registration.scope).href;
    event.respondWith(fetch(req).catch(() => caches.match(index).then((r) => r || Response.error())));
    return;
  }
  // fichiers du build (noms avec empreinte) : cache d'abord
  event.respondWith(caches.match(req).then((r) => r || fetch(req)));
});
