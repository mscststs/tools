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

export const getImage = async (url: string, proxy?: string): Promise<HTMLImageElement> => {
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
    let targetUrl = url;
    imageNode.crossOrigin = "anonymous";
    if (proxy) {
      targetUrl = proxy + targetUrl;
      if (~proxy.indexOf("baidu")) {
        imageNode.crossOrigin = null;
      } else {
      }
    }
    imageNode.src = targetUrl;
  });
};
