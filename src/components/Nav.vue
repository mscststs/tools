<script setup lang="ts">

import { homepage } from "../../package.json";
import { themeNames } from "../../config/themes";
import acknowledgments from "../../config/acknowledgments"
import { useLocalStorage } from "@vueuse/core";
import { watchEffect } from "vue";
import { RouterLink } from "vue-router"



const siteTheme = useLocalStorage("theme", "");

watchEffect(() => {
  const html = document?.querySelector("html");
  if (html) {
    html.dataset.theme = siteTheme.value;
  }
})


function toggleTheme(theme: string) {
  if (siteTheme.value === theme) {
    siteTheme.value = "";
  } else {
    siteTheme.value = theme;
  }
}


</script>

<template>
  <div class="navbar backdrop-blur-2xl px-6 gap-2 shadow">
    <div class="flex-none">
      <router-link to="/" class="btn btn-ghost normal-case text-xl">
        <i-icon icon="ext:tools"></i-icon>
        Tools
      </router-link>
    </div>
    <div class="flex-auto justify-center">

    </div>
    <div class="flex-none">
      <!-- Theme -->
      <div class="dropdown dropdown-end">
        <div tabindex="0" class="btn btn-ghost rounded-btn">
          <i-icon icon="ext:colorswatch" class="h-6 w-6"></i-icon>
          <span class="hidden font-normal md:inline">主题</span>
          <i-icon icon="ext:downfill" class="hidden w-5 fill-current sm:inline-block" />
        </div>
        <div tabindex="0"
          class="menu dropdown-content z-[1] p-2 shadow-xl bg-base-100 rounded-box w-52 mt-4 max-h-96 overflow-y-auto">
          <div class="grid grid-cols-1 gap-3" tabindex="0">
            <button v-for="theme of themeNames" :key="theme"
              class="outline-base-content overflow-hidden rounded-lg text-left" @click="toggleTheme(theme)">
              <div :data-theme="theme" class="bg-base-100 text-base-content w-full cursor-pointer font-sans">
                <div class="grid grid-cols-5 grid-rows-3">
                  <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                    <i-icon v-if="theme !== siteTheme" icon="ext:success" class="invisible h-3 w-3 shrink-0"></i-icon>
                    <i-icon v-else="theme!==siteTheme" icon="ext:success" class=" h-3 w-3 shrink-0"></i-icon>

                    <div class="flex-grow text-sm">{{ theme }}</div>
                    <div class="flex h-full flex-shrink-0 flex-wrap gap-1" data-svelte-h="svelte-izuv7l">
                      <div class="bg-primary w-2 rounded"></div>
                      <div class="bg-secondary w-2 rounded"></div>
                      <div class="bg-accent w-2 rounded"></div>
                      <div class="bg-neutral w-2 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </div>

        </div>
      </div>

      <!-- About -->
      <div class="dropdown dropdown-end">
        <div tabindex="0" class="btn btn-ghost rounded-btn">
          <i-icon icon="ext:cube3dline" class="h-6 w-6"></i-icon>
          <span class="hidden font-normal md:inline">相关</span>
          <i-icon icon="ext:downfill" class="hidden w-5 fill-current sm:inline-block" />
        </div>
        <ul tabindex="0" class="menu dropdown-content z-[1] p-2 shadow-xl bg-base-100 rounded-box w-52 mt-4">
          <li v-for="lib of acknowledgments" :key="lib.name">
            <a :href="lib.link" target="_blank" referrerpolicy="no-referrer" class="flex flex-row">
              <i-icon :icon="lib.icon" class="w-5 h-5"></i-icon>
              {{ lib.name }}
            </a>
          </li>
        </ul>
      </div>

      <div class="tooltip tooltip-bottom" data-tip="Github">
        <a class="btn btn-ghost" :href="homepage" target="_blank" referrerpolicy="no-referrer">
          <i-icon icon="ext:github" class="h-6 w-6"></i-icon>
        </a>
      </div>
    </div>
  </div>
</template>
