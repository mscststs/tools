interface UrlTemplate {
  name: string;
  interval: number;
  /**
   * @type {number} 间隔
   */
  delay: number;
  url: string;
  offset: number;
  width: number;
  height: number;
}

interface Seq {
  ts: number;
  url: string;
  node?: HTMLImageElement;
  status: "loading" | "loaded" | "failed";
}
interface ObjectData {
  [key: string]: any;
}
