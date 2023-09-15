import { escape_fetch } from "./";
import { error } from "../components/message";

const memoryCache: {
  [key: string]: any;
} = {};

/**
 * 由于有些图片可能来自 HTTP，这是一些图片代理服务
 * Baidu： https://image.baidu.com/search/down?url=
 * Akamai： https://imageproxy.pimg.tw/resize?url=
 * CloudFlare： https://images.weserv.nl/?url=
 *
 */

/**
 * 当前网页直发请求
 * @param url
 * @param crossOrigin
 * @returns
 */
const noProxy = async (url: string, crossOrigin?: HTMLImageElement["crossOrigin"]): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    if (memoryCache[url]) {
      resolve(memoryCache[url]);
      return;
    }

    const imageNode = new Image();
    imageNode.onerror = reject;
    imageNode.onload = () => {
      memoryCache[url] = imageNode;
      resolve(imageNode);
    };

    if (crossOrigin) {
      imageNode.crossOrigin = crossOrigin;
    }
    imageNode.src = url;
  });
};

const baiduProxy = async (url: string) => {
  return await noProxy(`https://image.baidu.com/search/down?url=${url}`);
};

const appmaskProxy = async (url: string) => {
  return await noProxy(`https://nmcimage.fbi-warning.eu.org/search/down?url=${url}`, "anonymous");
};

const wsrvProxy = async (url: string) => {
  return await noProxy(`https://wsrv.nl/?url=${url}`, "anonymous");
};

const mscNmcProxy = async (url: string) => {
  const u = new URL(url);
  u.host = "nmc-image.guangzhou-cvm.mscststs.com";
  u.protocol = "https:";
  return await noProxy(u.href, "anonymous");
};

const escapeProxy = async (url: string) => {
  const res = await escape_fetch(url);
  const target = URL.createObjectURL(res);
  return await noProxy(target);
};

export const getImage = async (url: string, proxy: string): Promise<HTMLImageElement> => {
  try {
    if (proxy === "escape") {
      return await escapeProxy(url);
    }
    if (proxy === "mscnmc") {
      return await mscNmcProxy(url);
    }
    if (proxy === "baidu") {
      return await baiduProxy(url);
    }
    if (proxy === "wsrv") {
      return await wsrvProxy(url);
    }
    if (proxy === "appmask") {
      return await appmaskProxy(url);
    }
    return await noProxy(url, "anonymous");
  } catch (e) {
    if (e instanceof Error) {
      error(e, url);
    } else {
      error("请求图片出错", url);
    }
    return await noProxy(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC",
    );
  }
};
