/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// Этот service worker можно подгонять!
// Смотри https://developers.google.com/web/tools/workbox/modules
// для списка доступных модулей Workbox, или добавить любой другой код, который вам нужен.
// Вы также можете удалить этот файл, если вы не хотите использовать
// service worker, и шаг сборки Workbox будет пропущен.

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate,CacheFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

// Предварительно кэшировать все активы, полученные в процессе сборки.
// Их URL вводятся в переменную манифеста ниже.
// Эта переменная должна присутствовать где-то в вашем service worker file,
// даже если вы решите не использовать перекачку. Смотри https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Настройка маршрутизации в стиле Арр Shell, так что все запросы навигации
// исполняются с помощью вашего index.htmlshell. Узнать больше на
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  // Возвращаем ложные, чтобы освободить запросы от выполнения с помощью index.html.
  ({ request, url }: { request: Request; url: URL }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== 'navigate') {
      return false;
    }

    // If this is a URL that starts with /_, skip.
    if (url.pathname.startsWith('/_')) {
      return false;
    }

    // If this looks like a URL for a resource, because it contains
    // a file extension, skip.
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }

    // Return true to signal that we want to use the handler.
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// Пример маршрута кэширования времени выполнения для запросов, которые не обрабатываются
// precache, в этом случае то же происхождение . png запросы, как те из в общественных/
registerRoute(
  // При необходимости добавляйте любые другие расширения файлов или критерии маршрутизации.
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'),
  // Настройте эту стратегию по мере необходимости, например, перейдя на CacheFirst.
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      // Убедитесь, что как только этот кэш во время выполнения достигнет максимального размера
      // удаляются изображения, используемые в последнее время.
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

// Это позволяет веб-приложению вызвать пропуск через
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});


// Любая другая пользовательская рабочая логика обслуживания может пойти здесь.
registerRoute(
    ({ url }) =>  {
        console.log('self.location.origin',self.location.origin)
        console.log('url.origin',url.origin)
        return  url.origin === self.location.origin
},
    new CacheFirst({
        cacheName: 'stories',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 5 * 60 // 5 минут
            }),
            new CacheableResponsePlugin({
                statuses: [0, 200]
            })
        ]
    })
)
