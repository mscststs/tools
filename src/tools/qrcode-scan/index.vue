<script setup lang="ts">

import { ref, watchEffect } from "vue";
import QrScanner from 'qr-scanner';
// import { usePermission } from "@vueuse/core";
import startCapture from "./capture";

/**
 * 识别结果
 */
const result = ref("");
/**
 * 识别 Source
 */
const imgSrc = ref("");
const imgRef = ref();


async function handleReadDisplay() {
  const mediaStream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: false,
  });
  try {
    let dataUrl = await startCapture(mediaStream);
    imgSrc.value = dataUrl;
  } catch (e) {
    console.error(e);
  } finally {
    mediaStream.getTracks().forEach(track => track.stop())
  }
}
async function handleReadUserMedia() {
  const mediaStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  try {
    let dataUrl = await startCapture(mediaStream);
    imgSrc.value = dataUrl;
  } catch (e) {
    console.error(e);
  } finally {
    mediaStream.getTracks().forEach(track => track.stop())
  }
}

async function handleReadFile(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0];
    if (file.type.startsWith("image")) {

      const blob = new Blob([file], { type: file.type || 'application/*' })
      const dataUrl = window.URL.createObjectURL(blob)
      imgSrc.value = dataUrl;

      target.value = "";

    } else {
      throw new Error("Format Not support");
    }
  }
}

async function handleReadClipboard() {
  try {
    const clipboardContents = await navigator.clipboard.read();
    for (const item of clipboardContents) {
      if (!item.types.includes("image/png")) {
        throw new Error("Clipboard contains non-image data.");
      }
      const blob = await item.getType("image/png");
      const dataUrl = URL.createObjectURL(blob);

      imgSrc.value = dataUrl;
    }
  } catch (e) {
    console.error(e);
  }
}

watchEffect(async () => {
  if (imgSrc.value) {
    result.value = "";
    try {
      let { data: res } = await QrScanner.scanImage(imgSrc.value, {
        alsoTryWithoutScanRegion: true,
      });
      result.value = res;
    } catch (e) {
      console.error(e);
    }
  }
});




</script>

<template>
  <div class="flex flex-col w-full">
    <div class="line py-4 flex flex-row gap-2">
      <button type="button" class="btn btn-neutral" @click="handleReadClipboard">
        从剪贴板识别
      </button>
      <label class="btn btn-neutral">
        <span>从文件识别</span>
        <input type="file" name="" id="" class="hidden" @change="handleReadFile">
      </label>
      <button type="button" class="btn btn-neutral" @click="handleReadDisplay">
        从屏幕识别
      </button>
      <button type="button" class="btn btn-neutral" @click="handleReadUserMedia">
        从相机识别
      </button>
    </div>

    <div class="line py-4" v-show="imgSrc">
      <img :src="imgSrc" alt="" :ref="imgRef"
        class="max-w-full max-h-[400px] sm:max-w-[600px] object-contain border-neutral-50 shadow hover:shadow-lg transition-shadow border-[1px]">
    </div>

    <div class="result py-4">
      <div class="form-control">
        <label class="label">
          <span class="label-text">识别结果</span>
        </label>
        <textarea class="textarea textarea-bordered h-24 w-full sm:w-[600px]" v-model="result" readonly></textarea>
      </div>
    </div>
  </div>
</template>