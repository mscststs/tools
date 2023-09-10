import { downloadBlob, downloadAsIframe } from "./";

class BlobDonwloadManager {
  chunks: any[] = [];
  filename = "";
  filetype = "";
  closed = false;
  constructor(filename: string, type: string) {
    this.filename = filename;
    this.filetype = type;
    this.chunks = [];
  }

  write(buf: Uint8Array) {
    if (buf.byteLength) {
    }
  }

  close() {
    if (this.closed) {
      return;
    }
    this.closed = true;
    if (this.chunks.length) {
      const blob = new Blob(this.chunks, {
        type: this.filetype,
      });
      downloadBlob(blob, this.filename);
    }
  }
}

class StreamDownloadManager {
  stream: WritableStreamDefaultWriter | FileSystemWritableFileStream | null = null;
  closed = false;
  constructor(stream: WritableStreamDefaultWriter | FileSystemWritableFileStream) {
    this.stream = stream;
  }

  write(buf: Uint8Array) {
    if (buf instanceof Uint8Array) {
      this.stream?.write(buf);
    } else {
      console.error("Write Failed; 仅支持 Uint8Array：", buf);
    }
  }

  close() {
    if (this.closed) {
      return;
    }
    this.closed = true;
    this.stream?.close();
  }
}

/**
 * @description 获取 showSaveFilePicker 提供的 FileSystemWritableFileStream
 * @param filename
 * @param type
 * @returns
 */
async function getFileStream(filename: string, type: FilePickerAcceptType["accept"]) {
  try {
    const canUseFilePicker = typeof window?.showSaveFilePicker === "function";
    if (canUseFilePicker) {
      const fileHandle = await window?.showSaveFilePicker({
        suggestedName: filename,
        types: [{ accept: type }],
      });
      const writable = await fileHandle.createWritable();
      return writable;
    } else {
      throw new Error("showSaveFilePicker Not Ready");
    }
  } catch (e) {
    return null;
  }
}

/**
 * @description 获取 serviceWorker 流式下载 Writer
 * @param filename
 * @returns writer
 */
async function getServiceWorkerStream(filename: string) {
  try {
    const registion = await navigator.serviceWorker.getRegistration();
    if (registion?.active?.state === "activated") {
      const sw = registion.active;

      const { port1, port2 } = new MessageChannel();
      const link = `/_stream_download/${Date.now()}_${Math.random()}/${encodeURIComponent(filename)}`;

      const stream = await new Promise<WritableStreamDefaultWriter>((resolve, reject) => {
        port1.onmessage = (event) => {
          const { data } = event;
          if (data.writable) {
            const writer = data.writable.getWriter();
            const removeIframe = downloadAsIframe(link);
            writer.closed.then(removeIframe);
            resolve(writer);
          } else {
            reject("No Writabel");
          }
        };
        sw.postMessage(
          {
            type: "streamDownload",
            link: link,
            filename: filename,
          },
          [port2],
        );
      });
      return stream;
    } else {
      throw new Error("serviceWorker Not Ready");
    }
  } catch (e) {
    return null;
  }
}

/**
 * @description 获取下载管理器
 * 会按顺序依次: ServiceWorker 流式下载、FileWriter 流式下载、Blob 下载
 *
 * @param filename 文件名
 * @param type 文件类型
 * @param allowStream 是否尝试流式下载
 */
export async function createDownloadManager(
  filename: string,
  type: FilePickerAcceptType["accept"],
  allowStream?: boolean,
) {
  if (allowStream) {
    const writer = await getServiceWorkerStream(filename);
    if (writer) {
      return new StreamDownloadManager(writer);
    }

    const fileWriter = await getFileStream(filename, type);
    if (fileWriter) {
      return new StreamDownloadManager(fileWriter);
    }
  }

  return new BlobDonwloadManager(filename, Object.keys(type)[0]);
}
