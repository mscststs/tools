import { timeout } from "./";

const requestEscapeVersion = "0.1";

export function escape_fetch(url: string, options?: Record<string, any>) {
  if (!isEscaped()) {
    install();
    throw new Error("请先安装越狱脚本");
  }

  return timeout(
    new Promise<Blob>((resolve, reject) => {
      window?.escape?.GM_xmlhttpRequest?.({
        url,
        method: options?.method ?? "get",
        data: options?.data,
        headers: options?.headers,
        responseType: "blob",
        fetch: true,
        onabort: reject,
        onerror: reject,
        onload: (response: any) => {
          if (response.status !== 200) {
            reject(new Error(response.statusText));
          } else {
            resolve(response.response);
          }
        },
      });
    }),
    10000,
  );
}

export function install() {
  window.open("https://greasyfork.org/zh-CN/scripts/475297", "_blank");
}

export function isEscaped() {
  if (window?.escape.version === requestEscapeVersion) {
    return true;
  } else {
    return false;
  }
}
