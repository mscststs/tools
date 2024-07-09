import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import wasm from "vite-plugin-wasm";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), wasm()],
  server: {
    host: "0.0.0.0",
    port: 8087,
  },
  build: {
    sourcemap: true,
  },
});
