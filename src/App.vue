<script setup lang="ts">
import Nav from "./components/Nav.vue"
import Footer from "./components/Footer.vue";
import { RouterView } from "vue-router";

</script>

<template>
  <div class=" flex flex-col overflow-y-auto h-screen min-w-[350px]">
    <Nav class="sticky top-0 z-[1] flex-none"></Nav>
    <div class="max-w-[100vw] px-6 py-6 flex flex-auto">
      <router-view></router-view>
    </div>
    <Footer class="flex-none"></Footer>
  </div>
</template>

<style scoped></style>
