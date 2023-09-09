import { downloadBlob } from "./";

class BlobDonwloadManager {
  chunks: any[] = [];
  filename = "";
  filetype = "";
  constructor(filename: string, type: string) {
    this.filename = filename;
    this.filetype = type;
    this.chunks = [];
  }

  write(blob: Blob | ArrayBuffer) {
    if (blob instanceof Blob) {
      if (blob.size) {
        this.chunks.push(blob);
      }
    } else {
      this.chunks.push(blob);
    }
  }

  close() {
    if (this.chunks.length) {
      const blob = new Blob(this.chunks, {
        type: this.filetype,
      });
      downloadBlob(blob, this.filename);
    }
  }
}

class StreamDownloadManager {
  stream: FileSystemWritableFileStream | null = null;
  constructor(stream: FileSystemWritableFileStream) {
    this.stream = stream;
  }

  write(chunk: FileSystemWriteChunkType) {
    this.stream?.write(chunk);
  }

  close() {
    this.stream?.close();
  }
}

export async function createDownloadManager(
  filename: string,
  type: FilePickerAcceptType["accept"],
  allowStream?: boolean,
) {
  const useStream = typeof window?.showSaveFilePicker === "function";
  if (useStream && allowStream) {
    const fileHandle = await window?.showSaveFilePicker({
      suggestedName: filename,
      types: [{ accept: type }],
    });
    const writable = await fileHandle.createWritable();
    return new StreamDownloadManager(writable);
  } else {
    return new BlobDonwloadManager(filename, Object.keys(type)[0]);
  }
}
