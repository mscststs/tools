<script setup lang="ts">
import { reactive } from "vue";
import { useRouter, } from 'vue-router';
import tools from "../tools/";
import { error } from "../components/message";

const router = useRouter();


const toolList = reactive(tools.map(item => {
  return {
    ...item,
    loading: false,
  }
}));

// 标记最后一次点击操作
let lastTo = null;

const loadTool = async (tool: (typeof toolList)[0]) => {
  lastTo = tool;
  tool.loading = true;
  try {
    await tool.component();
    if (lastTo === tool) {
      router.push({
        name: tool.id
      });
    }
  } catch (err) {
    if (err instanceof Error) {
      error(err);
    }
  }
  tool.loading = false;
}

</script>

<template>
  <div class="font-bold flex flex-row gap-4 ">
    <div class="tool-item flex flex-none " v-for="tool of toolList" :key="tool.id">
      <div class="btn btn-primary" @click="loadTool(tool)">
        <div class="swap" :class="tool.loading ? 'swap-active' : ''">
          <span class="swap-on loading loading-spinner loading-xs"></span>
          <i-icon :icon="tool.icon" class="swap-off w-4 h-4"></i-icon>
        </div>

        <span class="font-normal">{{ tool.name }}</span>
      </div>

    </div>
  </div>
</template>