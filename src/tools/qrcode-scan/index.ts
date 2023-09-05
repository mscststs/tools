export const qrcodeReader: Tool = {
  id: "qrcode-scan",
  name: "二维码扫描",
  icon: "ext:qrcodescan",
  type: "utils",
  component: () => import("./index.vue"),
};
