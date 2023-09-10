// service-worker.js
const SW_VERSION = "v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

const map = new Map();

self.onmessage = (event) => {
  const data = event.data;

  const filename = encodeURIComponent(data.filename.replace(/\//g, ":"))
    .replace(/['()]/g, escape)
    .replace(/\*/g, "%2A");

  const downloadUrl = `${self.registration.scope}_${Math.random()}/${filename}`;
  const port2 = event.ports[0];

  // [stream, data]
  const { readable, writable } = new TransformStream();

  const metadata = [readable, data];

  map.set(downloadUrl, metadata);
  port2.postMessage({ download: downloadUrl, writable }, [writable]);
};

/**
 * 缓存控制
 */
self.addEventListener("fetch", async (event) => {
  const { url } = event.request;
  const u = new URL(url);

  if (u.pathname.startsWith("/_stream_download/")) {
    // 处理流式下载
    const hijacke = map.get(url);

    if (!hijacke) return null;
    map.delete(url);

    const [stream, data] = hijacke;
    // Make filename RFC5987 compatible
    const fileName = encodeURIComponent(data.filename).replace(/['()]/g, escape).replace(/\*/g, "%2A");

    const headers = new Headers({
      "Content-Type": "application/octet-stream; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "response-content-disposition": "attachment",
      "Content-Disposition": `attachment; filename*=UTF-8'' ${fileName}`,
    });

    event.respondWith(new Response(stream, { headers }));
  } else {
    // 处理缓存
    event.respondWith(handleRequest(event.request));
  }
});

/**
 * @description 处理网络请求和缓存策略
 * 策略：在线优先，离线时使用缓存
 * @param {Reqeust} request
 * @returns
 */
async function handleRequest(request) {
  const { method } = request;
  try {
    // 尝试优先使用在线资源，并缓存
    const response = await fetch(request);
    if (method !== "get") {
      const responseClone = response.clone();
      caches.open(SW_VERSION).then(function (cache) {
        cache.put(request, responseClone);
      });
    }
    return response;
  } catch (error) {
    // 检查缓存资源
    const match = await caches.match(request);
    if (match) {
      return match;
    } else {
      // 检查目标是否为 document，如果是的话，走 SPA 逻辑，返回 /
      if (request.destination === "document") {
        return await caches.match(new Request("/"));
      }
    }
  }
}
