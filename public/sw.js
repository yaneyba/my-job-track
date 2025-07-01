// Version this cache - increment when you want to force cache refresh
const CACHE_NAME = 'myjobtrack-v2-' + Date.now();
const STATIC_CACHE_NAME = 'myjobtrack-static-v2';

// Cache strategies for different types of resources
const urlsToCache = [
  '/',
  '/manifest.json'
];

// Resources that should always be fresh (no caching)
const noCacheUrls = [
  '/api/',
  '/auth/',
  '/login',
  '/signup'
];

// Install event - cache core resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // Force activation of new service worker
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all clients
      return self.clients.claim();
    })
  );
});

// Fetch event - implement cache strategies
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Don't cache certain URLs
  if (noCacheUrls.some(pattern => url.pathname.startsWith(pattern))) {
    event.respondWith(fetch(event.request));
    return;
  }

  // For HTML requests, use network-first strategy
  if (event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the response for offline access
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request);
        })
    );
    return;
  }

  // For static assets (JS, CSS), use cache-first but with revalidation
  if (event.request.destination === 'script' || 
      event.request.destination === 'style' ||
      event.request.destination === 'image') {
    event.respondWith(
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) {
            // Check if cached version is stale (older than 1 hour)
            const cachedTime = response.headers.get('sw-cache-time');
            const now = Date.now();
            const oneHour = 60 * 60 * 1000;
            
            if (cachedTime && (now - parseInt(cachedTime)) < oneHour) {
              return response;
            }
          }
          
          // Fetch fresh version
          return fetch(event.request).then((fetchResponse) => {
            if (fetchResponse.ok) {
              const responseClone = fetchResponse.clone();
              // Add timestamp header
              const headers = new Headers(responseClone.headers);
              headers.set('sw-cache-time', Date.now().toString());
              
              const modifiedResponse = new Response(responseClone.body, {
                status: responseClone.status,
                statusText: responseClone.statusText,
                headers: headers
              });
              
              cache.put(event.request, modifiedResponse);
            }
            return fetchResponse;
          }).catch(() => {
            // Return stale cache if network fails
            return response;
          });
        });
      })
    );
    return;
  }

  // Default: network-first strategy
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});