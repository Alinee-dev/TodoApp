// ===============================
// Service Worker - Apptodo (AutoUpdate)
// ===============================

// 💡 Cambia este número en cada versión nueva
const CACHE_NAME = "apptodo-v11";

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

// ✅ INSTALACIÓN - Guarda en caché y activa de inmediato
self.addEventListener("install", (event) => {
  console.log("⚙️ Instalando nuevo Service Worker...");
  self.skipWaiting(); // 🚀 activa el nuevo SW sin esperar
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📦 Archivos cacheados correctamente");
      return cache.addAll(urlsToCache);
    })
  );
});

// 🧹 ACTIVACIÓN - Limpia versiones viejas y notifica clientes
self.addEventListener("activate", (event) => {
  console.log("🧽 Activando nueva versión y limpiando cachés viejas...");
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
      await self.clients.claim();

      // 🔁 Notifica a los clientes abiertos que hay una nueva versión
      const clientsList = await self.clients.matchAll({ type: "window" });
      for (const client of clientsList) {
        client.postMessage({ type: "NEW_VERSION" });
      }
    })()
  );
});

// ⚙️ FETCH - Usa caché primero, luego red
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).then((networkResponse) => networkResponse)
      );
    })
  );
});
