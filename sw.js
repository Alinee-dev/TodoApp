// ===============================
// Service Worker - Apptodo
// ===============================

// Nombre del caché (cámbialo con cada actualización importante)
const CACHE_NAME = "apptodo-v4"; // ⬅️ cambia el número al subir una nueva versión

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
console.log("Instalando nuevo Service Worker...");
  self.skipWaiting(); // 🔁 fuerza la activación inmediata del nuevo SW
event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
    console.log("Archivos cacheados correctamente");
    return cache.addAll(urlsToCache);
    })
);
});

// 🧹 ACTIVACIÓN - Elimina cachés antiguos y actualiza todas las pestañas abiertas
self.addEventListener("activate", (event) => {
console.log("Service Worker activado y limpiando cachés viejas...");
event.waitUntil(
    caches.keys().then((keys) =>
    Promise.all(
        keys
        .filter((key) => key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    )
    )
);
  self.clients.claim(); // ⚡ aplica la nueva versión a todos los usuarios
});

// ⚙️ FETCH - Responde con caché o red (funciona incluso offline)
self.addEventListener("fetch", (event) => {
event.respondWith(
    caches.match(event.request).then((response) => {
    return (
        response ||
        fetch(event.request).then((networkResponse) => {
          // Opcional: guarda en caché nuevos recursos si lo deseas
        return networkResponse;
        })
    );
    })
);
});
