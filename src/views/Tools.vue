<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { tools, createLoader } from "../tools";
import { ref, onMounted } from "vue";

const route = useRoute();
const router = useRouter();

const loading = ref(false);
let toolComponent: any = null;

const { toolName } = route.params;
let pageLoadStatus = ref("加载中");

onMounted(init);

async function init() {
  const targetTool = tools.find(item => item.id === toolName);
  if (!targetTool) {
    router.push("/404");
  } else {
    loading.value = true;
    const { loader, loadStatus } = createLoader(targetTool);
    pageLoadStatus = loadStatus;
    toolComponent = (await loader()).default;
    loading.value = false;
  }
}


</script>

<template>
  <div class="plugin-container flex flex-auto w-full">
    <template v-if="loading">
      <div class="flex-auto flex justify-center items-center">
        <div class="flex-none flex flex-row items-center  gap-4">
          <span class="loading loading-spinner loading-lg m-auto"></span>
          {{ pageLoadStatus }}
        </div>
      </div>
    </template>

    <component v-else :is="toolComponent"></component>
  </div>
</template>