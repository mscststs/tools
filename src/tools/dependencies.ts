/**
 * 依赖项
 */

export const pako: Dependencies = {
  name: "pako",
  type: "js",
  urls: ["/lib/pako.min.js", "https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js"],
};
export const upng: Dependencies = {
  name: "UPNG",
  type: "js",
  urls: ["/lib/UPNG.js", "https://cdn.jsdelivr.net/npm/upng-js@2.1.0/UPNG.min.js"],
  dependencies: [pako],
};
export const peerjs: Dependencies = {
  name: "peerjs",
  type: "js",
  urls: [
    "/lib/peerjs.min.js",
    "https://cdn.jsdelivr.net/npm/peerjs@1.5.0/dist/peerjs.min.js",
    "https://unpkg.com/peerjs@1.5.0/dist/peerjs.min.js",
  ],
};

export const mp4Remux: Dependencies = {
  name: "mp4-remux",
  type: "js",
  urls: [
    "/lib/mp4-remux.iife.js",
    "https://cdn.jsdelivr.net/npm/mp4-remux@latest/lib/mp4-remux.iife.js",
    "https://unpkg.com/mp4-remux@latest/lib/mp4-remux.iife.js",
  ],
};
