import type { Plugin } from "vue";

const plugin: Plugin = {
  install: (app) => {
    app.directive("autofocus", {
      mounted(el) {
        // 聚焦元素
        el.focus();
      },
    });
  },
};

export default plugin;
