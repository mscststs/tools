import { upng } from "../dependencies";

export const imageConver: Tool = {
  id: "image-convert",
  name: "图片转换器",
  icon: "ext:imageoutline",
  type: "media",
  component: () => import("./index.vue"),
  dependencies: [upng],
};
