<script setup lang="ts">
import { usePermission } from "@vueuse/core";
import { error, success } from "../../components/message"
import { ref, watchEffect, reactive, watch } from "vue";
import { filesize } from "filesize";
import { createBlob, getImage, download, formatTime } from "../../utils";


const supportClipBoard = !!navigator?.clipboard?.read ?? false;
const accessClipboard = usePermission("clipboard-read");


const imgRef = ref();
const imgSrc = ref("");
const targetImageSrc = ref("");

const originSize = ref("");
const targetSize = ref("");
let targetBlob: Blob | null = null;

function setOriginImage(blob: Blob) {
  originSize.value = filesize(blob.size);
  const dataUrl = URL.createObjectURL(blob);
  imgSrc.value = dataUrl;
}

function setTargetImage(blob: Blob) {
  targetBlob = blob;
  targetSize.value = filesize(blob.size);
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
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0];
    if (file.type.startsWith("image")) {

      const blob = new Blob([file], { type: file.type || 'application/*' });
      setOriginImage(blob);

      target.value = "";

    } else {
      error("不支持的格式")
      throw new Error("Format Not support");
    }
  }
}



async function handleReadPaste(e: ClipboardEvent) {
  if (e?.clipboardData?.items) {
    const image = [...e?.clipboardData?.items].find(item => {
      return item.kind === "file" && item.type.startsWith("image/")
    });
    if (image) {
      const imageFile = image?.getAsFile();
      if (imageFile) {

        const blob = new Blob([imageFile], { type: image.type || 'application/*' });
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
    const image = [...event.dataTransfer.items].find(item => {
      return item.kind === "file" && item.type.startsWith("image/")
    });
    if (image) {
      const imageFile = image?.getAsFile();
      if (imageFile) {

        const blob = new Blob([imageFile], { type: image.type || 'application/*' });
        setOriginImage(blob);
      }
    } else {
      error("不支持的格式");
    }
  }
}

async function handleDownload() {
  if (targetImageSrc.value) {
    download(targetImageSrc.value, `image_convert_${formatTime()}.${form.type.split("/")[1]}`)
  }
}
async function handleWriteClipBoard() {
  if (targetBlob) {
    const data = [new ClipboardItem({ [form.type]: targetBlob })];

    try {
      await navigator.clipboard.write(data);
      success("写入剪贴板成功");
    } catch (e) {
      if (e instanceof Error) {
        error(e, "请使用右键复制图片");
      }
    }
  }
}

const touchPanel = ref();
const maskStyle = ref("-webkit-mask-image : linear-gradient(to right, transparent 50% , 50%, #fff 100% );");
const splitStyle = ref("left:50%");
/**
 * @description 处理移动预览事件
 * @param event 
 */
async function handleChangeSplitLine(event: MouseEvent) {
  if (event.buttons && (event.buttons & 1)) {
    if (touchPanel.value) {
      const offsetleft = touchPanel.value.getBoundingClientRect().x;
      const fullWidth = touchPanel.value.clientWidth;
      const eventWidth = event.clientX;
      const targetPos = ((eventWidth - offsetleft) / fullWidth) * 100;
      maskStyle.value = `-webkit-mask-image : linear-gradient(to right, transparent ${targetPos}% , ${targetPos}%, #fff 100% );`
      splitStyle.value = `left: ${targetPos}%;`
    }

  }
}

const form = reactive({
  type: "image/jpeg",
  quality: "1",
});

const qualityTypes = ["image/webp", "image/jpeg"];

watchEffect(() => {
  if (!qualityTypes.includes(form.type)) {
    form.quality = "1";
  }
});

watch([imgSrc, form], async () => {
  if (imgSrc.value) {
    const image = await getImage(imgSrc.value, "");
    const blob = await createBlob(image, form.type, parseFloat(form.quality));
    setTargetImage(blob);
  }
});

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
      </div>
      <div class="divider sm:divider-horizontal"></div>
      <div class="line2 flex gap-4">
        <button type="button" class="btn btn-outline" @click="handleWriteClipBoard">复制到剪贴板</button>
        <button type="button" class="btn btn-outline" @click="handleDownload">下载</button>
      </div>
    </div>



    <div class="divider"></div>

    <!-- 输出控制 -->
    <div class="flex flex-none flex-row gap-4 justify-center items-center flex-wrap w-full" v-if="imgSrc">
      <div class="form-control w-full max-w-xs">
        <label class="label">
          <span class="label-text">输出格式</span>
        </label>
        <select class="select select-primary" v-model="form.type">
          <option :value="'image/png'">PNG</option>
          <option :value="'image/jpeg'">JPEG</option>
          <option :value="'image/webp'">WEBP</option>
        </select>
      </div>

      <div class="form-control w-full max-w-xs " v-show="['image/webp', 'image/jpeg'].includes(form.type)">
        <label class="label">
          <span class="label-text">质量</span>
          <span class="label-text-alt">{{ parseFloat(form.quality).toFixed(2) }}</span>
        </label>
        <input type="range" class="range range-primary my-3" :min="0" :max="1" :step="0.01" v-model="form.quality">
      </div>
    </div>


    <!-- 预览 -->
    <div
      class="render flex-none flex flex-col justify-center max-w-full w-[1200px] border border-primary relative touch-pan-y"
      v-show="imgSrc">
      <div class="indicator w-full absolute z-0 top-0 pointer-events-none">
        <img ref="imgRef" :src="imgSrc" alt="" class="object-scale-down mx-auto">
      </div>

      <div class="indicator w-full" @pointermove.stop.prevent="handleChangeSplitLine"
        @pointerdown="handleChangeSplitLine">
        <div class="wrap w-full" :style="maskStyle">
          <img :src="targetImageSrc" alt="" class="object-scale-down mx-auto drag-none">
        </div>
      </div>

      <div class="absolute z-10 top-0 w-full overflow-hidden pointer-events-none" ref="touchPanel">
        <div class="splitLine w-1 h-full absolute top-0 left-1/2 bg-opacity-70 bg-primary pointer-events-none"
          :style="splitStyle">

          <div class="indicator w-[100px] -translate-x-[50px]">
            <span class="indicator-item indicator-start badge badge-primary" title="After"> {{ originSize }}</span>
            <span class="indicator-item indicator-end badge badge-primary" title="After"> {{ targetSize }}</span>
          </div>
        </div>
        <img ref="imgRef" :src="imgSrc" alt="" class="object-scale-down mx-auto invisible">
      </div>

    </div>
  </div>
</template>