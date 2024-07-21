import { lamejs } from "../dependencies";

export const silkTransfer: Tool = {
  id: "silk-transfer",
  name: "SILK 转码",
  icon: "ext:micline",
  type: "media",
  component: () => import("./index.vue"),
  dependencies: [lamejs],
};
