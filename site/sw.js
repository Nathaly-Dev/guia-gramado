// Modo offline: guarda o guia no celular para abrir sem sinal na serra.
// Estratégia: responde do cache na hora e atualiza em segundo plano quando há internet.
// Ao mudar arquivos do guia, suba a versão para limpar o cache antigo.
const VERSION = "guia-v1";
const FILES = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/tokens.css",
  "css/components.css",
  "css/guia.css",
  "css/app.css",
  "js/theme.js",
  "js/app.js",
  "js/core.js",
  "js/roteiro.js",
  "js/preparo.js",
  "fonts/inter-latin-wght-normal.woff2",
  "fonts/space-grotesk-latin-wght-normal.woff2",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  // Só arquivos do próprio guia; a previsão do tempo tem cache próprio no app.
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.open(VERSION).then(async (cache) => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const fresh = fetch(req)
        .then((res) => {
          if (res.ok) cache.put(req, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || fresh;
    }),
  );
});
