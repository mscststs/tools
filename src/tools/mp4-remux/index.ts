import { mp4Remux as mp4RemuxLib } from "../dependencies";

export const mp4Remux: Tool = {
  id: "mp4-remux",
  name: "MP4 混流",
  icon: "ext:videooutline",
  type: "utils",
  component: () => import("./index.vue"),
  dependencies: [mp4RemuxLib],
};
