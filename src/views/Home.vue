<script setup lang="ts">
import { reactive } from "vue";
import { useRouter, } from 'vue-router';
import { tools, createLoader } from "../tools/";
import { error } from "../components/message";
import toolGroups from "../tools/groups";

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
    const { loader } = createLoader(tool);
    await loader();
    if (lastTo === tool) {
      router.push(`/tools/${tool.id}`);
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
  <div class="flex flex-col gap-4 font-bold  max-w-full mx-auto">
    <div class="flex flex-col mb-8" v-for="group of toolGroups" :key="group.key">
      <div class="title flex-none mb-4">{{ group.name }}</div>

      <div class="list flex flex-row flex-wrap gap-4 justify-start content-start">
        <div class="btn btn-primary flex-none" @click="loadTool(tool)"
          v-for="tool of toolList.filter(item => item.type === group.key)" :key="tool.id">
          <div class="swap" :class="tool.loading ? 'swap-active' : ''">
            <span class="swap-on loading loading-spinner loading-xs"></span>
            <i-icon :icon="tool.icon" class="swap-off w-4 h-4"></i-icon>
          </div>
          <span class="font-normal">{{ tool.name }}</span>
        </div>
      </div>

    </div>
  </div>
</template>