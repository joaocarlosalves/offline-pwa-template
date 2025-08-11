const CACHE_NAME = 'pwa-offline-cache-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './offline.html',
    './styles.css',
    './app.js',
    './manifest.json',
    './assets/icons/icon-192.png',
    './assets/icons/icon-512.png',
    './assets/fonts/Roboto-Regular.woff2',
    './assets/fonts/Roboto-Bold.woff2'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => 
            Promise.all(keys.filter((key) => 
                key !== CACHE_NAME).map((key) => caches.delete(key))
            )
        )
    );
    
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.mode === 'navigate') {
        event.respondWith(caches.match('./index.html').then((res) => res || caches.match('./offline.html')));
        return;
    };

    event.respondWith(
        caches.match(request).then((res) => {
            if (res) return res;
            return caches.match('./offline.html');
        })
    );
});
