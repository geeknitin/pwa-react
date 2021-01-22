const CACHE_NAME = "version-1";
const urlsToCache = [ 'index.html', 'offline.html' ];
const self = this;

// Install service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    )
});

// Listen for requests
// This matches with the requests going out from web page such as finding data for city for this application.
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                // for every outgoing request from the web page simply do fetch (request)
                return fetch(event.request)
                //in case there is error i.e no internet connection return offline.html file
                .catch(() => caches.match('offline.html'))
            })
    )
});

// Activate the service worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);
    // remove all other caches expect for CACHE_NAME from the browser
    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))
    )
});
