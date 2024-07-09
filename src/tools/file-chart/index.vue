<script setup lang="ts">
import { error } from "../../components/message";
import { ref } from "vue";
import treemap from "./treemap.vue";

const chartsData = ref<directoryList[]>([]);

function generateFileTreeByFiles(files: HTMLInputElement["files"]) {
  if (!files || files.length === 0) {
    return;
  }

  const treeMap: directoryList[] = [];
  const directoryMap: directoryMap = {};

  function getAndCreateDirectory(fullRelativeDirectory: string[]) {
    if (fullRelativeDirectory.length === 0) {
      return treeMap;
    }
    if (!directoryMap[fullRelativeDirectory.join("/")]) {
      const prev = getAndCreateDirectory(fullRelativeDirectory.slice(0, -1));
      const current: directoryList = {
        path: fullRelativeDirectory.join("/"),
        name: fullRelativeDirectory[fullRelativeDirectory.length - 1],
        children: [],
      };
      prev?.push(current);
      directoryMap[fullRelativeDirectory.join("/")] = current;
      return current.children;
    }
    return directoryMap[fullRelativeDirectory.join("/")].children;
  }

  for (const file of files) {
    const { name, webkitRelativePath, size } = file;
    const fullRelativeDirectory = webkitRelativePath.split("/");
    fullRelativeDirectory.pop(); // 移除文件名
    const dir = getAndCreateDirectory(fullRelativeDirectory);
    dir?.push({
      name: name,
      path: fullRelativeDirectory.join("/"),
      value: size,
    });
  }
  return treeMap;
}

const loading = ref(false);

function handleReadFile(event: Event) {
  if (loading.value) {
    return;
  }
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = target.files;
    loading.value = true;

    const treeData = generateFileTreeByFiles(files);
    if (treeData) {
      chartsData.value = treeData;
    }
    loading.value = false;

    target.value = "";
  } else {
    error("目录为空");
    throw new Error("Format Not support");
  }
}

async function handleReadDrop(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  if (event?.dataTransfer?.items) {
    for (const item of event.dataTransfer.items) {
      const fileHandler = await item.getAsFileSystemHandle();
      if (fileHandler?.kind === "directory") {
        if ("entries" in fileHandler && typeof fileHandler.entries === "function") {
          for await (const [key, value] of fileHandler.entries()) {
            console.log({ key, value });
          }
        }
        console.log("fileHandler", fileHandler);
      }
    }
  }
}
</script>

<template>
  <div class="flex flex-auto flex-col w-full relative" @drop="handleReadDrop" @dragover.prevent>
    <div class="flex flex-none flex-row justify-center gap-2">
      <label class="btn btn-primary">

        <template v-if="loading">
          <span class="loading loading-spinner"></span>
          解析中
        </template>
        <span v-else>选择文件夹</span>
        <input type="file" multiple webkitdirectory class="hidden" @change.prevent="handleReadFile">
      </label>
    </div>
    <div class="flex flex-auto flex-row justify-center mt-4 border-primary border p-2 box-border w-full"
      :class="chartsData.length === 0 ? 'invisible  ' : ''">
      <treemap :data="chartsData"></treemap>
    </div>
  </div>
</template>