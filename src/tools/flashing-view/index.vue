<script setup lang="ts">
import { ref, reactive, watch, onUnmounted } from 'vue';
import { useFullscreen, useWakeLock } from '@vueuse/core';
import { FrameController } from '../../utils';
import { SOSBlueColorSet, SOSGreenColorSet, SOSRedColorSet, SOSWhiteColorSet } from './colorSets';

const presets: Record<string, { frequency: number, colorSet: string[] }> = {
  "黄色": {
    frequency: 2,
    colorSet: ["#000", "#ff0"],
  },
  "红黄": {
    frequency: 2,
    colorSet: ["#f00", "#ff0"],
  },
  "红蓝": {
    frequency: 2,
    colorSet: ["#00f", "#f00"],
  },
  "SOS 白色": {
    frequency: 10,
    colorSet: SOSWhiteColorSet
  },
  "SOS 红色": {
    frequency: 10,
    colorSet: SOSRedColorSet
  },
  "SOS 蓝色": {
    frequency: 10,
    colorSet: SOSBlueColorSet
  },
  "SOS 绿色": {
    frequency: 10,
    colorSet: SOSGreenColorSet
  },
}
const presetsName = Object.keys(presets);

const el = ref(null);
const drawPanel = ref<HTMLDivElement>();

const { isSupported, request, release } = useWakeLock();
const { toggle: toggleFullscreen, isFullscreen } = useFullscreen(el);

// watch fullscreen ，禁用浏览器熄屏
if (isSupported) {
  watch(isFullscreen, (val) => {
    if (val) {
      request("screen");
    } else {
      release();
    }
  })
}

const form = reactive({
  preset: '红蓝',
  running: false,
  frequency: 2,
  colorSet: ["#0000ff", "#ff0000"],
});

function toggleRunning() {
  form.running = !form.running;
}

let frameController: FrameController;
onUnmounted(() => {
  frameController?.end()
});

watch([form], () => {
  frameController?.end()
  if (form.running) {
    let colorSet: string[];
    let frequency: number;
    if (form.preset === '自定义') {
      colorSet = form.colorSet;
      frequency = form.frequency;
    } else {
      colorSet = presets[form.preset].colorSet;
      frequency = presets[form.preset].frequency;
    }
    let i = 0;
    frameController = new FrameController(frequency, () => {
      if (drawPanel.value) {
        drawPanel.value.style.backgroundColor = colorSet[i];
      }
      i++;
      i = i % colorSet.length;
    })
  }
});


</script>

<template>
  <div class="flex flex-auto flex-col diff-view w-full gap-2">

    <div class="flex line flex-row flex-none gap-2 flex-wrap">
      <select class="select select-primary" v-model="form.preset">
        <option disabled selected>
          预设
        </option>
        <option :value="'自定义'">预设：自定义</option>
        <option v-for="name of presetsName" :value="name">预设：{{ name }}</option>
      </select>

      <template v-if="form.preset === '自定义'">
        <select class="select select-primary" v-model="form.frequency">
          <option disabled selected>
            频率
          </option>
          <option :value="60">频率 60 FPS</option>
          <option :value="30">频率 30 FPS</option>
          <option :value="20">频率 20 FPS</option>
          <option :value="10">频率 10 FPS</option>
          <option :value="5">频率 5 FPS</option>
          <option :value="2">频率 2 FPS</option>
          <option :value="1">频率 1 FPS</option>
          <option :value="0.5">频率 0.5 FPS</option>
        </select>

        <input type="color" class="border-primary input w-20" v-model="form.colorSet[0]">
        <input type="color" class="border-primary input w-20" v-model="form.colorSet[1]">
      </template>


      <button v-if="!form.running" type="button" class="btn btn-primary" @click="toggleRunning">开始</button>
      <button v-else type="button" class="btn btn-error" @click="toggleRunning">暂停</button>

      <button type="button" class="btn btn-primary" @click="toggleFullscreen">全屏</button>

    </div>
    <div class="divider"></div>
    <div class="flex flex-row flex-auto border border-primary overflow-hidden select-none bg-base-100" ref="el"
      @dblclick="toggleFullscreen">
      <div class="colorSet flex-auto" ref="drawPanel"></div>
    </div>
  </div>
</template>