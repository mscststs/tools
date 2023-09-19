interface Window {
  Peer: any;
}

interface ChatItem {
  type: string;
  from: "local" | "other";
  ts: number;
  data: string | ArrayBuffer;
  url?: string;
}
