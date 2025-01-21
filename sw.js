const version = 'v155';  // change this everytime you update the service worker
                          // to force the browser to also update it.



// Define cache names
const CACHE_NAME = 'my-app-cache-v1';
const DYNAMIC_CACHE_NAME = 'my-app-dynamic-cache-v1';

// Files to cache during installs
const STATIC_ASSETS = [
        'index.html',
        'style.css',
        'myscript.js',
        'icons/icon512_maskable.png',
        'icons/android-launchericon-512-512.png',
        'icons/android-launchericon-192-192.png',
        'icons/android-launchericon-144-144.png',
        'icons/android-launchericon-96-96.png',
        'apple.png',
        'bricks.webp',
        'responses.json',
        'sfx/extremely-loud-correct-buzzer.mp3',
        'sfx/extremely-loud-incorrect-buzzer.mp3',
        'loading-buffering.gif'
];

// Install event: Cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME && cache !== DYNAMIC_CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event: Network-first strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        if (networkResponse.status === 200) {
          return caches.open(DYNAMIC_CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        } else {
          return networkResponse;
        }
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});