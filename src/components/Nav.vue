<script setup lang="ts">
import { homepage } from "../../package.json";
import themes from "../../config/themes";
import acknowledgments from "../../config/acknowledgments"
import { themeChange } from 'theme-change'


themeChange(true);


</script>

<template>
  <div class="navbar fixed z-[1] backdrop-blur-xl px-12 gap-2 shadow">
    <div class="flex-none">
      <a class="btn btn-ghost normal-case text-xl" href="/">
        <i-icon icon="fa-solid:tools"></i-icon>
        Tools
      </a>
    </div>
    <div class="flex-auto justify-center">
      <div class="form-control">
        <input type="text" placeholder="Search" class="input input-bordered w-24 md:w-auto" />
      </div>
    </div>
    <div class="flex-none gap-2">
      <!-- Theme -->
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost rounded-btn">
          <i-icon icon="heroicons-outline:color-swatch" class="h-6 w-6"></i-icon>
          Theme
          <i-icon icon="mingcute:down-fill" class="w-5 fill-current" />
        </label>
        <div tabindex="0"
          class="menu dropdown-content z-[1] p-2 shadow-xl bg-base-100 rounded-box w-52 mt-4 max-h-96 overflow-y-auto">
          <div class="grid grid-cols-1 gap-3" tabindex="0">
            <button v-for="theme of themes" :key="theme" class="outline-base-content overflow-hidden rounded-lg text-left"
              :data-set-theme="theme" data-act-class="[&_svg]:visible">
              <div :data-theme="theme" class="bg-base-100 text-base-content w-full cursor-pointer font-sans">
                <div class="grid grid-cols-5 grid-rows-3">
                  <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                    <i-icon icon="mdi:success" class="invisible h-3 w-3 shrink-0"></i-icon>
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
        <label tabindex="0" class="btn btn-ghost rounded-btn">
          <i-icon icon="mingcute:cube-3d-line" class="h-6 w-6"></i-icon>
          About
          <i-icon icon="mingcute:down-fill" class="w-5 fill-current" />
        </label>
        <ul tabindex="0" class="menu dropdown-content z-[1] p-2 shadow-xl bg-base-100 rounded-box w-52 mt-4">
          <li v-for="lib of acknowledgments" :key="lib.name">
            <a :href="lib.link" target="_blank" referrerpolicy="no-referrer" class="flex flex-row">
              <i-icon :icon="lib.icon" class="w-5 h-5"></i-icon>
              {{ lib.name }}
            </a>
          </li>
        </ul>
      </div>

      <a class="btn btn-ghost" :href="homepage" target="_blank" referrerpolicy="no-referrer">
        <i-icon icon="mdi:github" class="h-6 w-6"></i-icon>
      </a>
    </div>
  </div>
</template>
