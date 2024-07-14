export const ledView: Tool = {
  id: "led-view",
  name: "LED 灯牌",
  icon: "ext:movieboard",
  type: "utils",
  component: () => import("./index.vue"),
  dependencies: [],
};
