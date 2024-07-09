// service-worker.js
const SW_VERSION = "v1";
const ExtendsList = ["clarity.ms"];

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

const map = new Map();

/**
 * 处理
 */
function handleStreamDownload(event) {
  const { data } = event;
  const { type, link, filename } = data;
  const port2 = event.ports[0];
  const { readable, writable } = new TransformStream();

  const metadata = [readable, data];

  map.set(link, metadata);
  port2.postMessage({ writable }, [writable]);
}

self.onmessage = (event) => {
  const data = event.data;
  if (data.type === "streamDownload") {
    handleStreamDownload(event);
  }
};

/**
 * 缓存控制
 */
self.onfetch = (event) => {
  const { url } = event.request;
  const u = new URL(url);

  if (u.pathname.startsWith("/_stream_download/")) {
    event.respondWith(handleRequestStreamDownload(event.request));
  } else {
    const { url } = event.request;
    if (ExtendsList.find((item) => ~url.indexOf(item))) {
      // 第三方跨域服务组件，不处理
      return;
    }
    // 处理缓存
    event.respondWith(handleRequest(event.request));
  }
};

async function handleRequestStreamDownload(request) {
  // 处理流式下载

  const { url } = request;
  const u = new URL(url);
  const streamMap = map.get(u.pathname);
  if (!streamMap) {
    const init = { status: 200 };
    const myResponse = new Response("Failed To Locate Stream", init);
    return myResponse;
  }
  map.delete(url);
  const [stream, data] = streamMap;
  // Make filename RFC5987 compatible
  const fileName = encodeURIComponent(data.filename).replace(/['()]/g, escape).replace(/\*/g, "%2A");

  const headers = new Headers({
    "Content-Type": "application/octet-stream; charset=utf-8",
    "Transfer-Encoding": "chunked",
    "response-content-disposition": "attachment",
    "Content-Disposition": `attachment; filename*=UTF-8''${fileName}`,
  });

  return new Response(stream, { headers });
}

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
      caches.open(SW_VERSION).then((cache) => {
        cache.put(request, responseClone);
      });
    }
    return response;
  } catch (error) {
    // 检查缓存资源
    const match = await caches.match(request);
    if (match) {
      return match;
    }
    // 检查目标是否为 document，如果是的话，走 SPA 逻辑，返回 /
    if (request.destination === "document") {
      return await caches.match(new Request("/"));
    }
  }
}
