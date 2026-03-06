/* ==================== Service Worker - 缓存管理 ==================== */

const CACHE_VERSION = "v1";
const CACHE_NAME = `boyuvhat-top-cache-${CACHE_VERSION}`;

const APP_SHELL = ["/", "/index.html", "/manifest.json"];

/* ───────── Install: 预缓存应用壳 ───────── */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

/* ───────── Activate: 清理旧缓存（排查冲突，删除原版本，创建新版本） ───────── */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* ───────── Fetch: 网络优先，失败时回退缓存 ───────── */
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // 只处理同源请求
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch((err) => {
        console.warn("[SW] Fetch failed, falling back to cache:", err);
        return caches.match(event.request);
      })
  );
});
