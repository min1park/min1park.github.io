// Cache-versioned service worker for the Classic Games PWA.
// Bump the VERSION whenever assets change to invalidate old caches.
const VERSION = 'v9';
const CACHE = `mp-classic-games-${VERSION}`;

const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/games/tic-tac-toe.html',
  '/games/memory-card.html',
  '/games/2048.html',
  '/games/snake.html',
  '/games/breakout.html',
  '/games/minesweeper.html',
  '/games/tetris.html',
  '/games/whack-a-mole.html',
  '/games/sudoku.html',
  '/games/space-invaders.html',
  '/games/omok.html',
  '/games/territory.html',
  '/games/chess.html',
  '/games/janggi.html',
  '/games/cascade.html',
  '/games/othello.html',
  '/games/math-gates.html',
  '/games/math-defender.html',
  '/games/lemonade.html'
];

// Pre-cache all known assets on install.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Clear old caches when a new version activates.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache-first for same-origin GETs; network fallback updates the cache.
// Cross-origin (fonts) bypasses cache so existing browser behavior wins.
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // let browser handle cross-origin

  event.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req)
        .then(resp => {
          if (resp && resp.ok) {
            const clone = resp.clone();
            caches.open(CACHE).then(c => c.put(req, clone)).catch(() => {});
          }
          return resp;
        })
        .catch(() => cached);
      // Return cached immediately if present (instant), update in background.
      return cached || network;
    })
  );
});
