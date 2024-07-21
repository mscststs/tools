export const imageBackgroundRemoval: Tool = {
  id: "image-background-removal",
  name: "背景消除",
  icon: "ext:imageadjust",
  type: "media",
  component: () => import("./index.vue"),
};
