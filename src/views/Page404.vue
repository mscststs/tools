<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="hero flex-auto justify-center items-center">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold font-serif">404</h1>
        <p class="py-12"> 人皆讥造次，我独赏专精 </p>

        <router-link to="/" class="btn btn-neutral rounded-full px-8">返回首页</router-link>
      </div>
    </div>
  </div>
</template>