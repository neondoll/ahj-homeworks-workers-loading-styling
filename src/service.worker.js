/* eslint-disable no-undef */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

/* eslint-disable no-undef */
if (workbox) {
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

  const CACHE_NAME = 'v1';
  const FETCH_PRIORITY_URLS = ['/', '/app.css', '/index.html'];

  async function addAllToCache(requests) {
    const cache = await caches.open(CACHE_NAME);

    await cache.addAll(requests);
  }

  async function putToCache(request, response) {
    const cache = await caches.open(CACHE_NAME);

    await cache.put(request, response);
  }

  async function cachePriorityThenFetch(event) {
    const cacheResponse = await caches.match(event.request);

    if (cacheResponse) {
      return cacheResponse;
    }

    let response;

    try {
      response = await fetch(event.request);
    }
    catch (error) {
      console.log(error);

      return;
    }

    await putToCache(event.request, response.clone());

    return response;
  }

  async function fetchPriorityThenCache(event) {
    let response;

    try {
      response = await fetch(event.request);
    }
    catch (error) {
      console.log(error);

      const cacheResponse = await caches.match(event.request);

      if (cacheResponse) {
        return cacheResponse;
      }

      return new Response('Нет соединения');
    }

    await putToCache(event.request, response.clone());

    return response;
  }

  self.addEventListener('install', (event) => {
    console.log('Установлен');

    event.waitUntil(addAllToCache(['./', './app.css', './app.js', './index.html']));
  });

  self.addEventListener('activate', () => {
    console.log('Активирован');
  });

  self.addEventListener('fetch', (event) => {
    console.log('Происходит запрос на сервер', event.request.url);

    const url = new URL(event.request.url);

    if (url.pathname.startsWith('/api') || ['chrome-extension:', 'ws:'].includes(url.protocol)) {
      return;
    }

    if (FETCH_PRIORITY_URLS.includes(url.pathname)) {
      event.respondWith(fetchPriorityThenCache(event));

      return;
    }

    event.respondWith(cachePriorityThenFetch(event));
  });
}
