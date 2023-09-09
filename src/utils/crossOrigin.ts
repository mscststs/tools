class CrossOrigin {
  private loaded = false;
  private iframe = document.createElement("iframe");
  private iframeSrc = "//org.ssl.6aas.cn.proxy.fbi-warning.eu.org/crossOrigin.html";
  private rpcList: {
    [key: string]: {
      resolve: Function;
      reject: Function;
      func: string;
      params?: Object;
    };
  } = {};

  constructor() {
    this.listen();
  }

  handleResolve(id: string, data: any) {
    if (this.rpcList[id]) {
      this.rpcList[id].resolve(data);
    }
  }
  handleReject(id: string, data: string) {
    if (this.rpcList[id]) {
      this.rpcList[id].reject(new Error(data));
    }
  }

  listen() {
    window.addEventListener("message", (event) => {
      const struct = JSON.parse(event.data);
      const { id, type, data } = struct;
      if (type === "rpc-resolve") {
        this.handleResolve(id, data);
      } else if (type === "rpc-reject") {
        this.handleReject(id, data);
      }
    });
  }

  call(func: string, params?: object) {
    const id = Date.now() + Math.random();
    return new Promise((resolve, reject) => {
      this.rpcList[id] = {
        resolve,
        reject,
        func,
        params,
      };
      this.iframe?.contentWindow?.postMessage(
        JSON.stringify({
          id,
          type: "rpc-call",
          func,
          params,
        }),
      );
    });
  }

  async prepare() {
    if (this.loaded) {
      return this;
    } else {
      this.iframe.className = "hidden";
      await new Promise((resolve, reject) => {
        this.iframe.addEventListener("load", () => {
          resolve("true");
        });
        this.iframe.addEventListener("error", (event) => {
          reject(event);
        });
        this.iframe.src = this.iframeSrc;
        document.body.appendChild(this.iframe);
      });
      this.loaded = true;

      return this;
    }
  }
}

let single: CrossOrigin | null = null;

async function getInstance() {
  if (!single) {
    single = new CrossOrigin();
  }
  return await single.prepare();
}

export default getInstance;
