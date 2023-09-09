// service-worker.js
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

self.onfetch = (event) => {
  const url = event.request.url;

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
};
