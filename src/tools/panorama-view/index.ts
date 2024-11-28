export const panoramaView: Tool = {
  id: "panorama-view",
  name: "全景照片查看",
  icon: "ext:panorama",
  type: "utils",
  component: () => import("./index.vue"),
};
