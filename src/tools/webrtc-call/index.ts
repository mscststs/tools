import { peerjs } from "../dependencies";

export const webrtcCall: Tool = {
  id: "webrtc-call",
  name: "WebRTC",
  icon: "ext:webrtc",
  type: "utils",
  component: () => import("./index.vue"),
  dependencies: [peerjs],
};
