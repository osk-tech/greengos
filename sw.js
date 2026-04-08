const CACHE_NAME = 'greengos-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap'
];

// Install Event - Cachear archivos
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Cacheando archivos');
                return cache.addAll(ASSETS);
            })
            .then(() => self.skipWaiting())
            .catch((error) => console.error('[Service Worker] Error en install:', error))
    );
});

// Activate Event - Limpiar caché viejo
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activando...');
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => {
                        console.log('[Service Worker] Borrando cache viejo:', key);
                        return caches.delete(key);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event - Estrategia Cache First con Network Fallback
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // No cachear requests POST
    if (request.method !== 'GET') {
        return;
    }

    // Cachear origin mismo + Google Fonts
    if (url.origin === location.origin || request.url.includes('fonts.googleapis.com')) {
        event.respondWith(
            // Primero intentar cache
            caches.match(request)
                .then((response) => {
                    if (response) {
                        console.log('[Service Worker] Sirviendo desde cache:', request.url);
                        return response;
                    }

                    // Si no está en cache, fetch
                    return fetch(request)
                        .then((response) => {
                            // Solo cachear respuestas exitosas
                            if (!response || response.status !== 200 || response.type === 'error') {
                                return response;
                            }

                            // Clonar respuesta
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    console.log('[Service Worker] Cacheando:', request.url);
                                    cache.put(request, responseClone);
                                });

                            return response;
                        })
                        .catch(() => {
                            console.log('[Service Worker] Offline - No se pudo cargar:', request.url);
                            
                            // Si es un documento y no está disponible, servir index.html
                            if (request.destination === 'document') {
                                return caches.match('/index.html')
                                    .then((response) => response || new Response(
                                        '<h1>Offline</h1><p>Por favor, conecta a internet para usar la aplicación</p>',
                                        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
                                    ));
                            }
                            
                            return new Response('Offline - Recurso no disponible', {
                                status: 503,
                                statusText: 'Service Unavailable',
                                headers: { 'Content-Type': 'text/plain' }
                            });
                        });
                })
        );
    }
});

// Handle messages from clients
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('[Service Worker] Cargado exitosamente');
