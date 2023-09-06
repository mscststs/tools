<script setup lang="ts">

import { ref, watchEffect } from "vue";
import QrScanner from 'qr-scanner';
import { useClipboard, usePermission } from "@vueuse/core";
import startCapture from "./capture";
import { error } from "../../components/message"

/**
 * 识别结果
 */
const result = ref("");
/**
 * 识别 Source
 */
const imgSrc = ref("");
const imgRef = ref();

const supportClipBoard = !!navigator?.clipboard?.read ?? false;
const supportGetUserMedia = !!navigator?.mediaDevices?.getUserMedia ?? false;
const supportGetDisplayMedia = !!navigator?.mediaDevices?.getDisplayMedia ?? false;

const accessClipboard = usePermission("clipboard-read");
const accessGetUserMedia = usePermission("camera");

const { copy, copied } = useClipboard({
  legacy: true
});



async function handleReadDrop(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  if (event?.dataTransfer?.items) {
    const image = [...event.dataTransfer.items].find(item => {
      return item.kind === "file" && item.type.startsWith("image/")
    });
    if (image) {
      const imageFile = image?.getAsFile();
      if (imageFile) {

        const blob = new Blob([imageFile], { type: image.type || 'application/*' })
        const dataUrl = window.URL.createObjectURL(blob)
        imgSrc.value = dataUrl;
      }
    } else {
      error("不支持的格式");
    }
  }

}

async function handleReadDisplay() {
  try {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });
    try {
      let dataUrl = await startCapture(mediaStream);
      imgSrc.value = dataUrl;
    } catch (e: any) {
      console.error(e);
    } finally {
      mediaStream.getTracks().forEach(track => track.stop())
    }
  } catch (e: any) {
    error(e);
  }

}
async function handleReadUserMedia() {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }, // 优先使用后置摄像头
      audio: false,
    });
    try {
      let dataUrl = await startCapture(mediaStream);
      imgSrc.value = dataUrl;
    } catch (e: any) {
      console.error(e);
    } finally {
      mediaStream.getTracks().forEach(track => track.stop())
    }
  } catch (e: any) {
    error(e);
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
      error("不支持的格式")
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
  } catch (e: any) {
    error(e);
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
    } catch (e: any) {
      error(e);
      console.error(e);
    }
  }
});




</script>

<template>
  <div class="flex flex-col w-full 2xl:flex-row" @drop="handleReadDrop" @dragover.prevent>
    <div class="left flex flex-col flex-auto w-full 2xl:w-0.5">
      <div class="line py-4 flex flex-row gap-2 flex-wrap justify-start sm:justify-center 2xl:justify-start">
        <button type="button" class="btn btn-primary" @click="handleReadClipboard" v-if="supportClipBoard"
          :disabled="accessClipboard === 'denied'">
          从剪贴板识别
        </button>
        <label class="btn btn-primary">
          <span>从文件识别</span>
          <input type="file" class="hidden" @change.prevent="handleReadFile" accept="image/*">
        </label>
        <button type="button" class="btn btn-primary" @click="handleReadDisplay" v-if="supportGetDisplayMedia">
          从屏幕识别
        </button>

        <button type="button" class="btn btn-primary" @click="handleReadUserMedia" v-if="supportGetUserMedia"
          :disabled="accessGetUserMedia === 'denied'">
          从相机识别
        </button>
      </div>

      <div class="line py-4  flex justify-center 2xl:justify-start" v-show="imgSrc">
        <img :src="imgSrc" alt="" :ref="imgRef"
          class="max-w-full max-h-[400px] sm:max-w-[600px] object-contain border-primary shadow hover:shadow-lg transition-shadow border-[1px]">
      </div>
    </div>
    <div class="divider divider-horizontal hidden 2xl:flex"></div>

    <div class="right flex flex-auto w-full 2xl:w-0.5 ">

      <div class="result flex-auto py-4 flex justify-center 2xl:justify-start">
        <div class="form-control w-full sm:w-[600px]">
          <label class="label">
            <span class="label-text">识别结果</span>
            <span class="label-text-alt cursor-pointer hover:font-bold" v-if="result" @click="copy(result)">
              <i-icon icon="ext:success" class="inline" v-if="copied"></i-icon>
              <i-icon icon="ext:clipboard" class="inline" v-else></i-icon>

              复制</span>
          </label>
          <textarea class="textarea textarea-bordered h-24 w-full" v-model="result" readonly></textarea>
        </div>
      </div>
    </div>

  </div>
</template>