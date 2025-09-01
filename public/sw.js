// FestiWise Service Worker - Clean Version
const CACHE_NAME = 'festiwise-v1';
const DYNAMIC_CACHE = 'festiwise-dynamic-v1';

// Files to cache on install
const STATIC_ASSETS = [
  '/',
  '/quiz',
  '/festivals',
  '/blog',
  '/faq'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  // console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching core assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Core assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Failed to cache assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  // console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // console.log('✅ Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - network first with cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Handle different types of requests
  if (request.method === 'GET') {
    event.respondWith(handleRequest(request));
  }
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // For navigation requests (pages)
    if (request.mode === 'navigate') {
      return await handleNavigation(request);
    }
    
    // For static assets
    if (url.pathname.includes('/_next/static/') || 
        url.pathname.endsWith('.css') || 
        url.pathname.endsWith('.js') || 
        url.pathname.endsWith('.png') || 
        url.pathname.endsWith('.jpg') || 
        url.pathname.endsWith('.svg')) {
      return await handleStaticAsset(request);
    }
    
    // For API and data requests
    if (url.pathname.includes('/api/') || url.pathname.endsWith('.json')) {
      return await handleApiRequest(request);
    }
    
    // Default: network first
    return await fetch(request);
    
  } catch (error) {
    console.warn('🔥 Fetch failed:', request.url, error);
    return await handleOffline(request);
  }
}

async function handleNavigation(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Ultimate fallback - try to serve index page
    const indexResponse = await caches.match('/');
    if (indexResponse) {
      return indexResponse;
    }
    
    // Final fallback
    return new Response(
      '<html><body><h1>Offline</h1><p>Please check your connection</p></body></html>',
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}

async function handleStaticAsset(request) {
  // Cache first for static assets
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.warn('📦 Static asset fetch failed:', request.url);
    throw error;
  }
}

async function handleApiRequest(request) {
  try {
    // Network first for API requests
    const networkResponse = await fetch(request);
    
    // Cache successful responses for short term
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    // Fallback to cache for API requests
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('📡 Serving cached API response:', request.url);
      return cachedResponse;
    }
    
    throw error;
  }
}

async function handleOffline(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Return offline page for navigation requests
  if (request.mode === 'navigate') {
    return new Response(
      '<html><body><h1>You are offline</h1><p>Please check your internet connection</p></body></html>',
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
  
  throw new Error('Offline and no cache available');
}

// Message handling
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATS') {
    getCacheStats().then((stats) => {
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

// console.log('🚀 FestiWise Service Worker v2.0 loaded - PWA ready!');