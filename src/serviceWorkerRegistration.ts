// Этот необязательный код используется для регистрации service worker.
// по умолчанию регистр() не вызывается.

// Это позволяет приложению быстрее загружаться при последующих посещениях в производстве, и дает
// он оффлайн возможностей. Однако, это также означает, что разработчики (и пользователи)
// будет видеть только развернутые обновления при последующих посещениях страницы, в конце концов
// существующие вкладки, открытые на странице, были закрыты, так как ранее кэшированы
// ресурсы обновляются в фоновом режиме.

// Узнать больше о преимуществах этой модели и инструкциях о том, как
// зарегистрироваться, читать https://cra.link/PWA

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: Config) {
  // if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  if ('serviceWorker' in navigator) {
    console.log('serviceWorker есть в навигаторе')
    // Конструктор URL доступен во всех браузерах, поддерживающих SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      console.log('serviceWorker работать не будет!!!')
      // Наш service worker не будет работать, если PUBLIC_URL находится на другом происхождении
      // от того, на чем находится наша страница. Это может произойти, если CDN используется для
      // обслуживать активы; см. https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        console.log('serviceWorker определил, что он на localhost')
        // Это работает на localhost. Давайте проверим, существует ли serviceWorker или нет.
        checkValidServiceWorker(swUrl, config);

        // Добавить некоторые дополнительные журналы для localhost, указывая разработчикам на
        // документация service worker/PWA.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service ' +
              'worker. To learn more, visit https://cra.link/PWA'
          );
        });
      } else {
        console.log('serviceWorker определил, что он запущен не в localhost')
        // Это не localhost. Просто зарегистрировать service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl: string, config?: Config) {
  console.log('функция registerValidSW запущена')
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('registration',registration)
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        console.log('installingWorker',installingWorker)
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // На данный момент обновлённое содержимое предварительно кэшированное было получено,
              // но предыдущий service worker все равно будет служить пожилым
              // содержимое до закрытия всех клиентских вкладок.
              console.log('Новый контент доступен и будет использоваться, когда вкладки для этой страницы.');
              // Execute callback
              if (config && config.onUpdate) {
                console.log('config.onUpdate')
                config.onUpdate(registration);
              }
            } else {
              // На данный момент, все было схвачено.
              // Это идеальное время для отображения
              // "Содержимое кэшируется для автономного использования." сообщение.
              console.log('Содержимое кэшируется для автономного использования.');

              // Execute callback
              if (config && config.onSuccess) {
                console.log('config.onSuccess')
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl: string, config?: Config) {
  // Проверьте, можно ли найти service worker. Если он не может перезагрузить страницу.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      console.log('response',response)
      // Убедитесь, что service worker существует, и что мы действительно получаем JS-файл.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // Сервис не найден. Вероятно, другое приложение. Перезагрузите страницу.
        console.log('Не найден service worker!')
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Найден service worker. Продолжайте, как обычно.
        console.log('Найден service worker!')
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
