import { qrScanner } from "../dependencies";

export const qrcodeReader: Tool = {
  id: "qrcode-scan",
  name: "二维码扫描",
  icon: "ext:qrcodescan",
  type: "encode",
  component: () => import("./index.vue"),
  dependencies: [qrScanner],
};
