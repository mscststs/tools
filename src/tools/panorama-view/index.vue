<script setup lang="ts">

import { Viewer } from '@photo-sphere-viewer/core';
import "@photo-sphere-viewer/core/index.css";


import { usePermission } from "@vueuse/core";
import { error } from "../../components/message";
import { nextTick, onBeforeUnmount, reactive, ref } from "vue";
import { useUrlSearchParams, useFullscreen } from '@vueuse/core';

import prompt from './prompt';



const supportClipBoard = !!navigator?.clipboard?.read;
const accessClipboard = usePermission("clipboard-read");
const imgList: string[] = reactive([]);
const current = ref(0);

const el = ref(null);




const { toggle: toggleFullscreen } = useFullscreen(el);

function addImage(blob: Blob | string) {
  const nurl = blob instanceof Blob ? URL.createObjectURL(blob) : blob;
  if (imgList.includes(nurl)) {
    return
  }
  imgList.push(nurl);
  update(nurl)
}



let viewer: Viewer | null = null;

onBeforeUnmount(() => {
  viewer?.destroy();
})

async function update(img: string) {
  await nextTick()
  current.value = imgList.indexOf(img);
  if (!viewer) {
    viewer = new Viewer({
      container: "#panorama_viewer",
      panorama: img,
      navbar: false,
      keyboard: "always",
      keyboardActions: {
        ArrowRight: () => {
          update(imgList[(current.value + 1) % imgList.length]);

        },
        ArrowLeft: () => {
          update(imgList[(current.value - 1 + imgList.length) % imgList.length]);
        }
      }
    });
    viewer.addEventListener("dblclick", () => toggleFullscreen());
  } else {
    viewer.setPanorama(img);
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
      // setOriginImage(blob);
      addImage(blob);
    }
  } catch (e: any) {
    error(e);
  }
}

async function handleReadFile(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files?.[0]) {
    const file = target.files[0];
    if (file.type.startsWith("image")) {
      const blob = new Blob([file], { type: file.type || "application/*" });
      // setOriginImage(blob);
      addImage(blob);

      target.value = "";
    } else {
      error("不支持的格式");
      throw new Error("Format Not support");
    }
  }
}

async function handleReadPaste(e: ClipboardEvent) {
  if (e?.clipboardData?.items) {
    const image = [...e.clipboardData.items].find((item) => {
      return item.kind === "file" && item.type.startsWith("image/");
    });
    if (image) {
      const imageFile = image?.getAsFile();
      if (imageFile) {
        const blob = new Blob([imageFile], { type: image.type || "application/*" });
        // setOriginImage(blob);
        addImage(blob);
      }
    } else {
      error("不支持的格式");
    }
  }
}

async function handleReadDrop(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  if (event?.dataTransfer?.items) {
    const images = [...event.dataTransfer.items].filter((item) => {
      return item.kind === "file" && item.type.startsWith("image/");
    });
    if (images.length) {
      images.forEach((image) => {

        const imageFile = image?.getAsFile();
        if (imageFile) {
          const blob = new Blob([imageFile], { type: image.type || "application/*" });
          // setOriginImage(blob);
          addImage(blob);
        }
      })
    } else {
      error("不支持的格式");
    }
  }
}
async function handleReadUrl() {
  const url = (await prompt("请输入URL:")).trim();
  if (url.startsWith("http")) {
    addImage(url);
  } else {
    error("不合法的链接");
  }
}


// 检查要不要处理 url 带过来的图片
const { img } = useUrlSearchParams();
if (img) {
  if (typeof img === "string" && img.startsWith("http")) {
    addImage(img);
  }
}


</script>

<template>
  <div class="flex flex-col w-full items-center gap-4 select-none" @drop="handleReadDrop" @dragover.prevent
    @paste="handleReadPaste">
    <!-- 输入按钮 -->
    <div class="flex flex-col sm:flex-row w-full flex-none justify-center items-center gap-4">
      <div class="line1 flex gap-4">

        <button type="button" class="btn btn-primary" @click="handleReadClipboard" v-if="supportClipBoard"
          :disabled="accessClipboard === 'denied'">
          从剪贴板获取
        </button>

        <label class="btn btn-primary">
          <span>从文件获取</span>
          <input type="file" class="hidden" @change.prevent="handleReadFile" accept="image/*">
        </label>

        <button type="button" class="btn btn-primary" @click="handleReadUrl">
          从URL获取
        </button>
      </div>

    </div>



    <div class="divider"></div>


    <!-- 预览 -->
    <div class="flex flex-col flex-auto w-full relative select-none" ref="el">
      <div id="panorama_viewer" class="panoramaViewer flex-auto"></div>
      <div
        class="thumbnail-wrap absolute h-32 bottom-0 w-full group overflow-auto flex flex-row items-center justify-center gap-4 backdrop-blur bg-[rgba(0,0,0,0.2)]"
        v-show="imgList.length > 1">
        <template v-for="(img, index) of imgList" :key="img">
          <img :src="img" class="w-32 h-24 cursor-pointer rounded backdrop-brightness-0"
            :data-active="index === current" @click="update(img)" draggable="false">
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
:fullscreen {
  .thumbnail-wrap {
    opacity: 0;
    transition: all 0.5s;
    transition-delay: 2s;

    &:hover {
      opacity: 1;
      transition-delay: 0s;
    }
  }
}

.thumbnail-wrap {

  [data-active="true"] {
    box-shadow: 0 0 0 2px var(--fallback-p, oklch(var(--p) / 1));
  }
}
</style>