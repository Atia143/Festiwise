// sw-source.js - Service Worker source file for Workbox InjectManifest
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { NavigationRoute } from 'workbox-routing';
import { skipWaiting, clientsClaim } from 'workbox-core';

// Aggressive update strategy
skipWaiting();
clientsClaim();

// Precache app shell and static assets - Workbox will inject the manifest
precacheAndRoute(self.__WB_MANIFEST || []);

// Clean up old cache versions automatically
cleanupOutdatedCaches();

// 1. Navigation Routes - NetworkFirst with offline fallback
const navigationHandler = new NetworkFirst({
  cacheName: 'navigations-v1',
  networkTimeoutSeconds: 3, // 3s timeout as specified
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 24 * 60 * 60, // 1 day
    }),
  ],
});

// Handle navigation requests with offline fallback
const navigationRoute = new NavigationRoute(navigationHandler, {
  denylist: [/^\/_/, /\/[^/?]+\.[^/]+$/], // Exclude API routes and static files
});
registerRoute(navigationRoute);

// Offline fallback for navigation
registerRoute(
  ({ request }) => request.mode === 'navigate',
  async ({ event }) => {
    try {
      return await navigationHandler.handle({ event, request: event.request });
    } catch (error) {
      // Return cached offline page for critical routes
      const url = new URL(event.request.url);
      const criticalRoutes = ['/', '/quiz', '/festivals'];
      
      if (criticalRoutes.some(route => url.pathname === route || url.pathname.startsWith(route))) {
        const cache = await caches.open('navigations-v1');
        const cachedResponse = await cache.match(url.pathname);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Ultimate fallback - return cached homepage
        return await cache.match('/') || new Response(
          '<html><body><h1>Offline</h1><p>Please check your connection</p></body></html>',
          { headers: { 'Content-Type': 'text/html' } }
        );
      }
      throw error;
    }
  }
);

// 2. JSON Data - StaleWhileRevalidate for fresh content
registerRoute(
  ({ request, url }) => {
    return url.pathname.endsWith('.json') || 
           url.pathname.includes('/api/') ||
           url.pathname.includes('/data/');
  },
  new StaleWhileRevalidate({
    cacheName: 'json-data-v1',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
        purgeOnQuotaError: true,
      }),
    ],
  })
);

// 3. Images - CacheFirst with expiration
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-v1',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 300,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        purgeOnQuotaError: true,
      }),
    ],
  })
);

// 4. Static Chunks & Fonts - StaleWhileRevalidate for updates
registerRoute(
  ({ request, url }) => {
    return request.destination === 'script' ||
           request.destination === 'style' ||
           request.destination === 'font' ||
           url.pathname.includes('/_next/static/');
  },
  new StaleWhileRevalidate({
    cacheName: 'static-assets-v1',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        purgeOnQuotaError: true,
      }),
    ],
  })
);

// 5. External APIs - NetworkFirst with short cache
registerRoute(
  ({ url }) => url.origin !== self.location.origin,
  new NetworkFirst({
    cacheName: 'external-apis-v1',
    networkTimeoutSeconds: 5,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  })
);

// Background sync for newsletter submissions (when implemented)
self.addEventListener('sync', (event) => {
  if (event.tag === 'newsletter-sync') {
    event.waitUntil(syncNewsletterSubmissions());
  }
});

async function syncNewsletterSubmissions() {
  // Will implement newsletter offline queue later
  console.log('Background sync: Newsletter submissions');
}

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATS') {
    getCacheStats().then(stats => {
      event.ports[0].postMessage(stats);
    });
  }
});

async function getCacheStats() {
  const cacheNames = await caches.keys();
  const stats = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    stats[cacheName] = keys.length;
  }
  
  return stats;
}

console.log('🚀 FestiWise Service Worker v1.0 loaded - PWA ready!');
