<script setup lang="ts">
import { ref, shallowRef, watch } from 'vue';
import { useLocalStorage } from '@vueuse/core';



const diffEditorRef = shallowRef();
const handleMount = (diffEditor: any) => (diffEditorRef.value = diffEditor);

const OPTIONS = {
  automaticLayout: true,
  originalEditable: true,
  readOnly: false,
};

watch(() => diffEditorRef, () => {
  const originEditor = diffEditorRef.value.getOriginalEditor();
  originEditor.set
});

const theme = ref("vs-dark");
const language = ref("plaintext");
const languages = [
  "plaintext",
  "javascript",
  "html",
  "css"
];


const siteTheme = useLocalStorage("theme", "");

const el = ref();

// 检查主题色并切换 monaco 主题
watch(
  [siteTheme, el],
  () => {
    if (el.value) {
      const v = window.getComputedStyle(el.value);
      const bgColor = v.backgroundColor;
      const matches = bgColor.match(/\d+/g)?.map(v => parseInt(v));
      if (matches && matches.length === 3) {
        const [r, g, b] = matches;
        const isLight = (r + g + b) / 3 > 128 ? true : false;
        theme.value = isLight ? "vs" : "vs-dark"
      }
    }
  });




</script>

<template>
  <div class="flex flex-auto flex-col diff-view w-full gap-2">
    <!-- 用于获取主题色 -->
    <div class="bg-base-100 w-5 h-5 hidden" ref="el"></div>

    <div class="line flex-row flex-none">
      <select class="select select-primary" v-model="language">
        <option :value="item" v-for="item of languages" :key="item">{{ item }}</option>
      </select>
    </div>
    <div class="divider"></div>
    <div class="flex-auto border border-primary">

      <DiffEditor :theme=theme original="" :originalLanguage="language" modified="" :modifiedLanguage="language"
        originalModelPath="a.txt" modifiedModelPath="b.txt" :options="OPTIONS" @mount="handleMount">
      </DiffEditor>
    </div>
  </div>
</template>