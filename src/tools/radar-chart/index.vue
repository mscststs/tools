<script setup lang="ts">
import { computed, ref, watchEffect, reactive } from "vue";
import { error } from "../../components/message";
import { getImage, formatTime, sleep, createBlob, createDownloadManager } from "../../utils";
import { mmcRadar } from "./data.ts";
import prompt from "./recorder-prompt.tsx";
// import jsZip from "jszip";
import * as fflate from "fflate";


function getTimeVariables(date: Date) {
  const vars: ObjectData = {
    UTC_YEAR: date.getUTCFullYear(),
    UTC_MONTH: date.getUTCMonth() + 1,
    UTC_DATE: date.getUTCDate(),
    UTC_HOUR: date.getUTCHours(),
    UTC_MINUTE: date.getMinutes(),
    YEAR: date.getFullYear(),
    MONTH: date.getMonth() + 1,
    DATE: date.getDate(),
    HOUR: date.getHours(),
    MINUTE: date.getMinutes(),
  }
  Object.keys(vars).forEach((key) => {
    vars[key] = vars[key].toString().padStart(2, "0");
  });
  return vars;

}


const form = reactive({
  selectArea: mmcRadar[0].name,
  selectDuration: 3 * 60 * 60 * 1000,
  selectedProxy: "crossOrigin"
});

const selectArea = computed<UrlTemplate | null>(() => {
  return mmcRadar.find(item => form.selectArea === item.name) || null;
});

const loadedArea = ref<UrlTemplate>()


/**
 * 根据
 */
function getUrls(tmpl: UrlTemplate, duration: number) {
  const cur = Date.now() - tmpl.delay;
  const tsMin = cur - duration;
  let tail = cur - cur % tmpl.interval;
  const result = [];
  while (tail > tsMin) {
    result.push(tail);
    tail -= tmpl.interval
  }


  return result.map(ts => {
    let url = tmpl.url;
    const timeVars = getTimeVariables(new Date(ts));
    url = url.replace(/\$\{(.+?)\}/g, (_, fn1) => {
      if (fn1 in timeVars) {
        return "" + timeVars[fn1 as keyof typeof timeVars]
      }
      return fn1;
    });
    const seq: Seq = {
      url,
      ts,
      status: "loading"
    }
    return seq;
  });
}

let seqs = ref<Seq[]>([]);

const loadedSeq = computed(() => {
  return seqs.value.filter(item => {
    return item.status === "loaded"
  })
});

let loading = ref(false);
let recording = ref(false);
/**
 * 创建序列并加载图片
 */
async function createSequence() {
  if (loading.value) {
    loading.value = false;
  } else {
    loading.value = true;
    try {
      if (!selectArea.value) {
        return;
      }
      loadedArea.value = selectArea.value;
      seqs.value = getUrls(selectArea.value, form.selectDuration).reverse();

      currentView.value = seqs.value[seqs.value.length - 1].ts.toString();
      for (let i = seqs.value.length - 1; i >= 0; i--) {
        if (!loading.value) {
          break; // 中断加载
        }
        const imageElement = await getImage(seqs.value[i].url, form.selectedProxy);
        seqs.value[i].status = "loaded";
        seqs.value[i].node = imageElement;
        // console.log("loaded:", imageElement);
      }
    } catch (e: any) {
      if (e instanceof Error) {
        error(e)
      }
    } finally {
      loading.value = false;
    }
  }
};


let currentView = ref("0");

const ImageCanvas = ref();


watchEffect(() => {
  if (currentView.value && ImageCanvas.value) {
    const seq = loadedSeq.value.find(item => item.ts == parseInt(currentView.value));
    if (seq && seq.node) {
      const ctx = ImageCanvas.value?.getContext("2d");
      ctx.drawImage(seq.node, 0, 0);
    }
  }
});
const zipLoading = ref(false);

async function zipDownload() {
  zipLoading.value = true;
  try {
    if (!loadedArea.value) {
      return
    }

    const downloadManager = await createDownloadManager(
      `RadarPack_${selectArea.value?.name ?? ['未知']}_${formatTime()}.zip`,
      {
        "application/zip": ".zip"
      },
      true
    );

    const zip = new fflate.Zip((err, dat, final) => {
      if (!err) {
        downloadManager.write(dat.buffer);
        if (final) {
          downloadManager.close();
        }
      } else {
        downloadManager.close();
      }
    });
    for (let item of loadedSeq.value) {
      if (!zipLoading) {
        zip.end();
        break;
      }
      if (item.node) {
        const blob = await createBlob(item.node);
        const image = new fflate.ZipDeflate(`${formatTime(new Date(item.ts))}.png`, { level: 9 });
        zip.add(image);
        image.push(new Uint8Array(await blob.arrayBuffer()), true);
      }
    }
    zip.end();
  } catch (e) {
    if (e instanceof Error) {
      error(e)
    }
  } finally {
    zipLoading.value = false;
  }
}

async function record() {
  if (recording.value) {
    recording.value = false;
  } else {
    recording.value = true;
    try {
      const canvas = ImageCanvas.value;
      const stream = canvas.captureStream(30);
      // const recordedChunks: any[] = [];

      const { mimeType, videoBitsPerSecond, speed } = await prompt();

      const downloadManager = await createDownloadManager(
        `RadarRecord_${selectArea.value?.name ?? ['未知']}_${formatTime()}.webm`,
        {
          [mimeType.split(";")[0]]: `.${mimeType.split(";")[0].split("/")[1]}`
        },
        true
      )

      const mediaRecorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond });
      mediaRecorder.ondataavailable = (event: any) => {
        downloadManager.write(event.data)
      };
      mediaRecorder.onerror = (event: any) => {
        error(event.error as Error)
        recording.value = false;
      }
      mediaRecorder.onstop = () => {
        downloadManager.close()
      }

      let index = 0;
      currentView.value = loadedSeq.value[index].ts.toString();
      mediaRecorder.start();
      while (recording.value && (parseInt(currentView.value) < loadedSeq.value[loadedSeq.value.length - 1].ts)) {
        await sleep(speed)
        index += 1;
        currentView.value = loadedSeq.value[index].ts.toString();
        mediaRecorder.requestData();
      }

      mediaRecorder.stop();
    } catch (e) {
      if (e instanceof Error) {
        error(e)
      }

    } finally {
      recording.value = false;
    }
  }
}



</script>

<template>
  <div class="flex-auto flex flex-col chart items-center">
    <div class="line form flex flex-row justify-center flex-none gap-2">
      <select class="select select-primary" v-model="form.selectArea">
        <option v-for="item of mmcRadar" :key="item.name" :value="item.name">{{ item.name }}</option>
      </select>
      <select class="select select-primary" v-model="form.selectDuration">
        <option :value="3 * 60 * 60 * 1000">3h</option>
        <option :value="6 * 60 * 60 * 1000">6h</option>
        <option :value="12 * 60 * 60 * 1000">12h</option>
        <option :value="24 * 60 * 60 * 1000">24h</option>
        <option :value="3 * 24 * 60 * 60 * 1000">3d</option>
        <option :value="7 * 24 * 60 * 60 * 1000">7d</option>
        <option :value="15 * 24 * 60 * 60 * 1000">15d</option>
      </select>
      <select class="select select-primary" v-model="form.selectedProxy">
        <option value="crossOrigin">线路1</option>
        <option value="baidu">线路2：百度（不支持录制和下载）</option>
        <option value="wsrv">线路3：wsrv.nl（不稳定）</option>
        <option value="">线路4：原始地址（不支持 HTTPS）</option>
      </select>
      <button class="btn btn-primary" @click="createSequence" :disabled="recording">
        <template v-if="loading">
          <span class="loading loading-spinner"></span>
          加载中 {{ loadedSeq.length }} {{ "/" }} {{ seqs.length }}
        </template>
        <template v-else>
          加载
        </template>
      </button>
    </div>

    <div class="preview flex-auto flex flex-col items-center w-fit pt-6" v-if="loadedSeq && loadedSeq.length">
      <div class="form flex-none w-full flex flex-row py-4 gap-4 items-center">
        <div class="btn btn-outline">
          {{ loadedArea?.name }}
        </div>
        <div class="btn btn-outline">
          {{ formatTime(new Date(parseInt(currentView))) }}
        </div>
        <input type="range" class="range range-primary flex-auto" :min="loadedSeq[0].ts"
          :max="loadedSeq[loadedSeq.length - 1].ts" :step="loadedArea?.interval" v-model="currentView"
          :disabled="recording">
        <button type="button" class="btn btn-primary" :disabled="loading" @click="record">
          <template v-if="recording">
            <span class="loading loading-spinner"></span>
            录制中
          </template>
          <template v-else>
            录制
          </template>
        </button>
        <button type="button" class="btn btn-primary" :disabled="loading" @click="zipDownload">
          <template v-if="zipLoading">
            <span class="loading loading-spinner"></span>
            打包中
          </template>
          <template v-else>
            归档下载
          </template>
        </button>
      </div>
      <canvas ref="ImageCanvas" :height="loadedArea?.height" :width="loadedArea?.width" class="flex-none"></canvas>
    </div>
  </div>
</template>