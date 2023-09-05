<script setup lang="ts">
import { RouterLink } from 'vue-router';
import tools from "../tools/";


</script>

<template>
  <div class="font-bold flex flex-row">
    <div class="tool-item flex flex-none" v-for="tool of tools" :key="tool.id">
      <router-link :to="{
        name: tool.id
      }" class="btn btn-neutral">
        <i-icon :icon="tool.icon"></i-icon>
        <span class="font-normal">{{ tool.name }}</span>
      </router-link>

    </div>
  </div>
</template>