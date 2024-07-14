<script setup lang="ts">

import { Vue3Marquee } from 'vue3-marquee'

import { ref, reactive } from 'vue'
import { useElementSize, useFullscreen } from '@vueuse/core'


const el = ref(null);
const inputEl = ref(null);

const pause = ref(false);

const { width, height } = useElementSize(el);
const { toggle } = useFullscreen(el)

const form = reactive({
  duration: 10,
  text: "请输入...",
  scale: 0.5,
  spacing: 0.1,
  color: "",
});

function handleFullScreen() {
  toggle();
}
function handlePause() {
  pause.value = !pause.value;
}

</script>

<template>
  <div class="flex flex-auto flex-col diff-view w-full gap-2">

    <div class="flex line flex-row flex-none gap-2 flex-wrap">
      <input type="text" class="input border-primary" v-model="form.text" ref="inputEl">

      <select class="select select-primary" v-model="form.duration">
        <option disabled selected>
          速度
        </option>
        <option :value="80">速度 5</option>
        <option :value="40">速度 10</option>
        <option :value="20">速度 20</option>
        <option :value="10">速度 40</option>
        <option :value="5">速度 80</option>
        <option :value="2">速度 200</option>
      </select>

      <select class="select select-primary" v-model="form.scale">
        <option disabled selected>
          缩放
        </option>
        <option :value="0.9">缩放 90%</option>
        <option :value="0.8">缩放 80%</option>
        <option :value="0.7">缩放 70%</option>
        <option :value="0.6">缩放 60%</option>
        <option :value="0.5">缩放 50%</option>
        <option :value="0.4">缩放 40%</option>
        <option :value="0.3">缩放 30%</option>
      </select>

      <select class="select select-primary" v-model="form.spacing">
        <option disabled selected>
          间距
        </option>
        <option :value="0.5">间距 50%</option>
        <option :value="0.4">间距 40%</option>
        <option :value="0.3">间距 30%</option>
        <option :value="0.2">间距 20%</option>
        <option :value="0.1">间距 10%</option>
        <option :value="0">间距 0%</option>
      </select>

      <input type="color" class="border-primary input" v-model="form.color">

      <button type="button" class="btn btn-primary" @click="handleFullScreen">全屏</button>

    </div>
    <div class="divider"></div>
    <div class="flex flex-row flex-auto border border-primary overflow-hidden select-none bg-base-100" ref="el"
      @dblclick="handleFullScreen" @click="handlePause">
      <Vue3Marquee class="!absolute overflow-hidden" :duration="form.duration" :style="{
        height: `${height}px`,
        width: `${width}px`,
        fontSize: `${height * form.scale}px`,
        lineHeight: `${height}px`,
        letterSpacing: `${height * form.scale * form.spacing}px`,
        color: `${form.color ? form.color : 'inherit'}`,
        pointerEvents: 'none'
      }" :pause="pause">
        {{ form.text }}
      </Vue3Marquee>

    </div>
  </div>
</template>