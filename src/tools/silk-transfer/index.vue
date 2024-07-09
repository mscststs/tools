<script setup lang="ts">
import { reactive, ref } from "vue";
import { decode, isSilk } from "./wasm";
import { createDownloadManager } from "../../utils/";
import { error } from "../../components/message";
import { downloadBlob } from "../../utils/";

function uint8ArrayToInt16Array(uint8Array: Uint8Array) {
  if (uint8Array.byteLength % 2 !== 0) {
    throw new Error("Uint8Array length must be even to convert to Int16Array.");
  }

  const int16Array = new Int16Array(uint8Array.byteLength / 2);

  for (let i = 0; i < uint8Array.byteLength; i += 2) {
    // 使用小端序方式将两个字节组合成一个 16 位整数
    const val = uint8Array[i] | (uint8Array[i + 1] << 8);
    // 将无符号的整数转换为有符号的
    int16Array[i / 2] = (val << 16) >> 16;
  }

  return int16Array;
}

const audio = ref();
const loading = ref(false);

const form = reactive({
  target: "MP3",
  rate: "44100",
  kbps: "128",
});

async function handleTransfer() {
  try {
    loading.value = true;
    const audioFile = audio.value.files[0];
    const buffer = await audioFile.arrayBuffer();
    if (!isSilk(buffer)) {
      error("不是silk音频");
      return;
    }
    // PCM Encode
    if (form.target === "PCM") {
      const res = await decode(buffer, Number(form.rate));
      const downloadManager = await createDownloadManager(
        `${audioFile.name}.pcm`,
        {
          "audio/*": ".pcm",
        },
        false,
      );
      downloadManager.write(res.data);
      downloadManager.close();
    }
    if (form.target === "MP3") {
      const res = await decode(buffer, Number(form.rate));

      const mp3encoder = new window.lamejs.Mp3Encoder(1, Number(form.rate), Number(form.kbps));
      const mp3Data = [];

      const samples = uint8ArrayToInt16Array(res.data);
      const sampleBlockSize = 1152;

      for (let i = 0; i < samples.length; i += sampleBlockSize) {
        const sampleChunk = samples.subarray(i, i + sampleBlockSize);
        const mp3buf = mp3encoder.encodeBuffer(sampleChunk);
        if (mp3buf.length > 0) {
          mp3Data.push(mp3buf);
        }
      }
      const mp3buf = mp3encoder.flush(); //finish writing mp3
      if (mp3buf.length > 0) {
        mp3Data.push(new Int8Array(mp3buf));
      }

      const mp3Result = new Blob(mp3Data, { type: "audio/mp3" });
      downloadBlob(mp3Result, `${audioFile.name}.mp3`);
    }
  } catch (e: any) {
    error(e?.message ?? "转码失败");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col flex-auto">
    <div class="flex flex-row gap-4 justify-center flex-wrap">
      <label class="btn btn-primary q-check">
        <span>选择silk音频</span>
        <input type="file" class="hidden" ref="audio" accept="*/*" required>
        <i-icon icon="ext:success"></i-icon>
      </label>

      <select class="select select-primary" v-model="form.rate">
        <option v-for="rate of [48000,44100,32000,24000,22050,16000,12000,11025,8000]" :value="rate">采样率：{{ rate }}</option>
      </select>

      
      <select class="select select-primary" v-model="form.kbps">
        <option v-for="rate of [128, 192, 320]" :value="rate">比特率：{{ rate }}</option>
      </select>

      <select class="select select-primary" v-model="form.target">
        <option v-for="rate of ['PCM','MP3']" :value="rate">{{ rate }}</option>
      </select>

      <button type="button" class="btn btn-primary" @click="handleTransfer">
        <span v-if="loading" class="loading loading-spinner"></span>
        转码
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