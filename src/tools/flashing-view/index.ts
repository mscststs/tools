export const flashingView: Tool = {
  id: "flashing-view",
  name: "警示灯",
  icon: "ext:warning",
  type: "utils",
  component: () => import("./index.vue"),
  dependencies: [],
};
