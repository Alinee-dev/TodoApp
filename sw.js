// Nombre del caché
const CACHE_NAME = "apptodo-v1";

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

// ✅ INSTALACIÓN - Se guarda todo en caché
self.addEventListener("install", (event) => {
event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
    console.log("Archivos cacheados correctamente");
    return cache.addAll(urlsToCache);
})
);
});

// 🧹 ACTIVACIÓN - Elimina cachés antiguos
self.addEventListener("activate", (event) => {
event.waitUntil(
    caches.keys().then((keys) =>
    Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    )
    )
);
console.log("Service Worker activado correctamente");
});

// ⚙️ FETCH - Responde con caché o red
self.addEventListener("fetch", (event) => {
event.respondWith(
    caches.match(event.request).then((response) => {
      // Devuelve desde caché o hace fetch si no existe
    return response || fetch(event.request);
    })
);
});
