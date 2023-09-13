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

const appmaskProxy = (url: string) => {
  return noProxy(`https://nmcimage.fbi-warning.eu.org/search/down?url=${url}`, "anonymous");
};

const wsrvProxy = async (url: string) => {
  return noProxy(`https://wsrv.nl/?url=${url}`, "anonymous");
};

const mscNmcProxy = async (url: string) => {
  const u = new URL(url);
  u.host = "nmc-image.guangzhou-cvm.mscststs.com";
  u.protocol = "https:";
  return noProxy(u.href, "anonymous");
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
  if (proxy === "appmask") {
    return await appmaskProxy(url);
  }
  return await noProxy(url, "anonymous");
};
