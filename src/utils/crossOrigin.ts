class CrossOrigin {
  private loaded = false;
  private iframe = document.createElement("iframe");
  private iframeSrc = "//org.ssl.6aas.cn.proxy.fbi-warning.eu.org/crossOrigin.html";

  call(func: string, params?: object) {
    return new Promise((resolve, reject) => {
      const channel = new MessageChannel();

      channel.port1.onmessage = (event) => {
        const struct = event.data;
        const { type, data } = struct;
        if (type === "rpc-resolve") {
          resolve(data);
        } else if (type === "rpc-reject") {
          reject(new Error(data));
        }
      };
      this.iframe?.contentWindow?.postMessage(
        {
          type: "rpc-call",
          func,
          params,
        },
        "*",
        [channel.port2],
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
