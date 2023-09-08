export const radarChart: Tool = {
  id: "radar-chart",
  name: "气象雷达图",
  icon: "ext:radar",
  type: "visual",
  component: () => import("./index.vue"),
};
