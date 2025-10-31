// ===============================
// Service Worker - Apptodo (AutoUpdate)
// ===============================

// 💡 Cambia este número en cada versión nueva
const CACHE_NAME = "apptodo-v9";

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

// ✅ INSTALACIÓN - Guarda en caché y fuerza activación inmediata
self.addEventListener("install", (event) => {
console.log("⚙️ Instalando nuevo Service Worker...");
  self.skipWaiting(); // 🚀 activa de inmediato sin esperar al anterior
event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
    console.log("📦 Archivos cacheados correctamente");
    return cache.addAll(urlsToCache);
    })
);
});

// 🧹 ACTIVACIÓN - Elimina cachés antiguos y recarga todas las pestañas
self.addEventListener("activate", (event) => {
console.log("🧽 Activando nueva versión y limpiando cachés viejas...");
event.waitUntil(
    caches.keys().then((keys) =>
    Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    )
    )
);

  // 🔁 Fuerza actualización en todas las instancias abiertas
event.waitUntil(
    (async () => {
    const clientsList = await self.clients.matchAll({ type: "window" });
    for (const client of clientsList) {
        client.navigate(client.url); // 🔄 recarga automáticamente
    }
    })()
);

  self.clients.claim(); // aplica el nuevo SW incluso en apps instaladas
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
