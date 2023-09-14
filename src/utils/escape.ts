const requestEscapeVersion = "0.1";

export function escape_fetch(url: string, options?: Record<string, any>) {
  if (!isEscaped()) {
    install();
    throw new Error("请先安装越狱脚本");
  }

  return new Promise<Blob>((resolve, reject) => {
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
        resolve(response.response);
      },
    });
  });
}

export function install() {
  window.open("/scripts/escape.user.js");
}

export function isEscaped() {
  if (window?.escape.version === requestEscapeVersion) {
    return true;
  } else {
    return false;
  }
}
