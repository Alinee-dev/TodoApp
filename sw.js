// ===============================
// Service Worker - Apptodo
// ===============================

// 💡 Cambia este número en cada versión nueva
const CACHE_NAME = "apptodo-v5";

// Archivos a guardar en caché
const urlsToCache = [
  "/",
  "/index.html",
  "/calendario.html",
  "/diario.html",
  "/finanzas.html",
  "/tareas.html",
  "/perfil.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// ✅ INSTALACIÓN - Guarda los archivos en caché y activa al instante
self.addEventListener("install", (event) => {
  console.log("🔧 Instalando nuevo Service Worker...");
  self.skipWaiting(); // activa el nuevo SW sin esperar
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📦 Archivos cacheados correctamente");
      return cache.addAll(urlsToCache);
    })
  );
});

// 🧹 ACTIVACIÓN - Elimina cachés antiguos y actualiza todas las pestañas abiertas
self.addEventListener("activate", (event) => {
  console.log("🧽 Activando y limpiando cachés antiguas...");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  // 🔁 Recarga las pestañas abiertas con la nueva versión
  self.clients.claim();
  self.clients.matchAll({ type: "window" }).then((clients) => {
    clients.forEach((client) => client.navigate(client.url));
  });
});

// ⚙️ FETCH - Responde con caché o red
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((networkResponse) => {
          return networkResponse;
        })
      );
    })
  );
});
