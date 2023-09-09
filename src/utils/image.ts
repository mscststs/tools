import getCrossOrigin from "./crossOrigin";

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

const baiduProxy = (url: string) => {
  return noProxy(`https://image.baidu.com/search/down?url=${url}`);
};

const wsrvProxy = async (url: string) => {
  return noProxy(`https://wsrv.nl/?url=${url}`);
};

const mscNmcProxy = async (url: string) => {
  const u = new URL(url);
  u.host = "nmc-image.guangzhou-cvm.mscststs.com";
  u.protocol = "https:";
  return noProxy(u.href);
};

const crossOriginProxy = async (url: string) => {
  const co = await getCrossOrigin();
  const blob = (await co.call("fetch", {
    url,
  })) as Blob;
  const target = URL.createObjectURL(blob);
  return await noProxy(target);
};

export const getImage = async (url: string, proxy: string): Promise<HTMLImageElement> => {
  if (proxy === "mscnmc") {
    return await mscNmcProxy(url);
  }
  if (proxy === "baidu") {
    return await baiduProxy(url);
  }
  if (proxy === "wsrv") {
    return await wsrvProxy(url);
  }
  if (proxy === "crossOrigin") {
    return await crossOriginProxy(url);
  }
  return await noProxy(url, "anonymous");
};
