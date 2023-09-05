<script setup lang="ts">
import { license } from "../../package.json"

</script>

<template>
  <footer class="footer footer-center items-center  p-4 bg-base-200 text-base-content rounded">

    <aside>
      <p>
        <i-icon icon="ext:copyleft" class="inline w-4 h-4"></i-icon>
        {{ license }} . {{ new Date().getFullYear() }} . Designed By <a href="https://mscststs.com" target="_blank"
          referrerpolicy="no-referrer">@mscststs</a>
      </p>
    </aside>
  </footer>
</template>