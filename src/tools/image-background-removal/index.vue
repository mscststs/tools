<script setup lang="ts">
import { usePermission } from "@vueuse/core";
import { error, success } from "../../components/message";
import { ref, reactive, watch, onUnmounted } from "vue";
import { getImage, download, formatTime } from "../../utils";

const supportWebgpu = !!navigator.gpu;
const showSupportAlert = ref(true);

const supportClipBoard = !!navigator?.clipboard?.read;
const accessClipboard = usePermission("clipboard-read");

const modelReady = ref(false);
const modelStatus = ref("");

const worker = new Worker("/worker/image_bg_removal_worker.js", {
  type: 'module'
});

// Create a callback function for messages from the worker thread.
const onMessageReceived = (e: any) => {
  const { eventType, eventData } = e.data;
  switch (eventType) {
    case "initiate":
      modelStatus.value = "初始化";
      break;
    case "download":
      modelStatus.value = "下载";
      break;
    case "progress":
      modelStatus.value = `加载(${eventData.progress}%)`;
      break;
    case "done":
      break;
    case "warmup":
      modelStatus.value = "预热";
      break;
    case "ready":
      modelReady.value = true;
      break;
    case "loaderr":
      error("加载模型失败，可能无法连接到 HuggingFace");
      break;
    case "startEvalute":
      modelReady.value = false;
      modelStatus.value = "计算中";

      break;
    case "finishEvalute":
      modelReady.value = true;
      modelStatus.value = "";
      setTargetImage(eventData.result);
      success(`成功，耗时${eventData.duration}ms`)
      break;
    default:
      console.log(eventType, eventData);
  }
};

function postMessage(type: string, data: any) {
  worker.postMessage({
    eventType: type,
    eventData: data,
  });
}

// Attach the callback function as an event listener.
worker.addEventListener('message', onMessageReceived);

onUnmounted(() => {
  worker.removeEventListener('message', onMessageReceived);
  worker.terminate();
});


const imgSrc = ref("");
const targetImageSrc = ref("");

const imageWidth = ref(1);
const imageHeight = ref(1);
let targetBlob: Blob | null = null;

async function setOriginImage(blob: Blob) {
  const dataUrl = URL.createObjectURL(blob);
  imgSrc.value = dataUrl;
  const image = await getImage(dataUrl);
  imageWidth.value = image.width;
  imageHeight.value = image.height;


}

function setTargetImage(blob: Blob) {
  targetBlob = blob;
  const dataUrl = URL.createObjectURL(blob);
  targetImageSrc.value = dataUrl;
}

async function handleReadClipboard() {
  try {
    const clipboardContents = await navigator.clipboard.read();
    for (const item of clipboardContents) {
      if (!item.types.includes("image/png")) {
        throw new Error("Clipboard contains non-image data.");
      }
      const blob = await item.getType("image/png");
      setOriginImage(blob);
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
      setOriginImage(blob);

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
        setOriginImage(blob);
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
    const image = [...event.dataTransfer.items].find((item) => {
      return item.kind === "file" && item.type.startsWith("image/");
    });
    if (image) {
      const imageFile = image?.getAsFile();
      if (imageFile) {
        const blob = new Blob([imageFile], { type: image.type || "application/*" });
        setOriginImage(blob);
      }
    } else {
      error("不支持的格式");
    }
  }
}

async function handleDownload() {
  if (targetImageSrc.value) {
    download(targetImageSrc.value, `image_background_removal_${formatTime()}.${form.type.split("/")[1]}`);
  }
}

async function handleWriteClipBoard() {
  if (targetBlob) {
    const data = [new ClipboardItem({ "image/png": targetBlob })];

    try {
      await navigator.clipboard.write(data);
      success("写入剪贴板成功");
    } catch (e) {
      if (e instanceof Error) {
        error(e, "写入剪贴板失败");
      }
    }
  }
}


const form = reactive({
  type: "image/png",
});


watch([imgSrc], () => {
  if (imgSrc) {
    targetImageSrc.value = "";
    postMessage("evalute", imgSrc.value);
  }
})


</script>

<template>
  <div class="flex flex-col w-full items-center gap-4 select-none" @drop="handleReadDrop" @dragover.prevent
    @paste="handleReadPaste">


    <div role="alert" className="alert " v-if="!supportWebgpu && showSupportAlert">
      <i-icon :icon="'ext:warning'" class="h-6 w-6"></i-icon>
      <span class="tracking-wide">该设备不支持
        <a href="https://developer.mozilla.org/docs/Web/API/WebGPU_API" class="link" target="_blank"
          referrerpolicy="no-referrer">WebGPU</a>
        ，计算过程将会缓慢</span>
      <div>
        <button className="btn btn-sm btn-outline" @click="() => { showSupportAlert = false }">好的</button>
      </div>
    </div>
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
      </div>

      <template v-if="!modelReady">
        <div class="divider sm:divider-horizontal"></div>
        <div class="text-base text-info flex-row flex align-middle">
          <span class="loading loading-spinner mr-3"></span>
          {{ modelStatus }}
        </div>
        <div class="divider sm:divider-horizontal"></div>
      </template>
      <template v-else>
        <div class="divider sm:divider-horizontal"></div>
      </template>

      <div class="line2 flex gap-4">
        <button type="button" class="btn btn-outline" @click="handleWriteClipBoard">复制到剪贴板</button>
        <button type="button" class="btn btn-outline" @click="handleDownload">下载</button>
      </div>
    </div>



    <div class="divider"></div>


    <!-- 预览 -->
    <div
      class="render flex-none flex flex-col justify-center max-w-full w-[1200px] border border-primary relative touch-pan-y"
      v-show="imgSrc">

      <div class="diff aspect-[16/9] bg-transparent">
        <div class="diff-item-1">
          <img v-if="targetImageSrc" alt="target" :src="targetImageSrc" class="object-contain" />
        </div>
        <div class="diff-item-2 border-primary">
          <img v-if="imgSrc" alt="origin" :src="imgSrc" class="object-contain" />
        </div>
        <div class="diff-resizer w-[50cqi]"></div>
      </div>

    </div>
  </div>
</template>

<style lang="css">
.diff-item-1:after {
  box-shadow: none;
  outline-color: var(--fallback-p, oklch(var(--p) / var(--tw-border-opacity)));
  border-color: var(--fallback-p, oklch(var(--p) / var(--tw-border-opacity)));
}

.bg-transparent {
  /* background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURb+/v////5nD/3QAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAUSURBVBjTYwABQSCglEENMxgYGAAynwRB8BEAgQAAAABJRU5ErkJggg=="); */
  background-image: repeating-linear-gradient(45deg, var(--fallback-b1, oklch(var(--b1))), var(--fallback-b1, oklch(var(--b1))) 13px, var(--fallback-b2, oklch(var(--b2))) 13px, var(--fallback-b2, oklch(var(--b2))) 14px);
}
</style>