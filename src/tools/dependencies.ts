/**
 * 依赖项
 */

export const pako: Dependencies = {
  name: "pako",
  type: "js",
  urls: ["https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js", "/lib/pako.min.js"],
};
export const upng: Dependencies = {
  name: "UPNG",
  type: "js",
  urls: ["https://cdn.jsdelivr.net/npm/upng-js@2.1.0/UPNG.min.js", "/lib/UPNG.js"],
  dependencies: [pako],
};
