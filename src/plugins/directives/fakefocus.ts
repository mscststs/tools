import { Plugin } from "vue";

/**
 * 该指令的作用
 *
 * 在插件渲染时，使焦点正确附着在插件内的 Dom 上
 * 但是不需要使 input 真的处于 focus 状态
 *
 * 这样就能够在没有发生点击时
 * 从插件层级的 dom 捕获到 paste 事件
 */

const plugin: Plugin = {
  install: (app) => {
    app.directive("fakefocus", {
      mounted(el) {
        el.focus();
        el.blur();
      },
    });
  },
};

export default plugin;
