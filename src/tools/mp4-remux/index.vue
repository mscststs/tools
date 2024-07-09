<script setup lang="ts">
import { ref } from "vue";
import { createDownloadManager } from "../../utils/";

const remux = window.mp4Remux;
const videoVideo = ref();
const videoAudio = ref();

async function handleRemux() {
  const audioFile = videoAudio.value.files[0];
  const videoFile = videoVideo.value.files[0];
  if (audioFile && videoFile) {
    const audioBlob = new Blob([audioFile], { type: "video/mp4" });
    const audioStream = audioBlob.stream();
    const videoBlob = new Blob([videoFile], { type: "video/mp4" });
    const videoStream = videoBlob.stream();
    const readable = remux(videoStream, audioStream);

    const downloadManager = await createDownloadManager(
      "file.mp4",
      {
        "video/mp4": ".mp4",
      },
      true,
    );
    const writable = new WritableStream({
      write: (chunk) => {
        downloadManager.write(chunk);
      },
      close: () => {
        downloadManager.close();
      },
    });
    readable.pipeTo(writable);
  }
}

if (parent !== self) {
  const messageChannel = new MessageChannel();
  const { port1, port2 } = messageChannel;
  parent.postMessage("Mp4Remux_loaded", "*", [port2]);

  let videoStream: ReadableStream;
  let audioStream: ReadableStream;
  port1.onmessage = async (e) => {
    const data = e.data;
    if (data.type === "video") {
      videoStream = data.stream;
    } else if (data.type === "audio") {
      audioStream = data.stream;
    } else if (data.type === "download") {
      const filename = data.filename;
      const downloadStream = data.stream;
      if (downloadStream) {
        const downloadManager = await createDownloadManager(
          `${filename}.mp4`,
          {
            "video/mp4": ".mp4",
          },
          true,
        );
        const writable = new WritableStream({
          write: (chunk) => {
            downloadManager.write(chunk);
          },
          close: () => {
            downloadManager.close();
          },
        });
        downloadStream.pipeTo(writable);
      }
    } else if (data.type === "remux") {
      const filename = data.filename;
      const readable = remux(videoStream, audioStream);
      const downloadManager = await createDownloadManager(
        `${filename}.mp4`,
        {
          "video/mp4": ".mp4",
        },
        true,
      );
      const writable = new WritableStream({
        write: (chunk) => {
          downloadManager.write(chunk);
        },
        close: () => {
          downloadManager.close();
        },
      });
      readable.pipeTo(writable);
    }
  };
}
</script>

<template>
  <div class="flex flex-col flex-auto">
    <div class="flex flex-row gap-4 justify-center">
      <label class="btn btn-primary q-check">
        <span>选择视频</span>
        <input type="file" class="hidden" ref="videoVideo" accept="video/*" required>
        <i-icon icon="ext:success"></i-icon>
      </label>
      <label class="btn btn-primary q-check">
        <span>选择音频</span>
        <input type="file" class="hidden" ref="videoAudio" accept="video/*" required>
        <i-icon icon="ext:success"></i-icon>
      </label>
      <button type="button" class="btn btn-primary" @click="handleRemux">
        合并
      </button>
    </div>
  </div>
</template>


<style lang="scss">
.q-check {
  input+* {
    display: none;
  }

  input:valid+* {
    display: inline;
  }
}
</style>