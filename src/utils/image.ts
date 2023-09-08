export const getImage = async (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const imageNode = new Image();
    imageNode.onerror = reject;
    imageNode.onload = () => {
      resolve(imageNode);
    };
    imageNode.crossOrigin = "anonymous";
    let targetUrl = url;
    if (url.startsWith("http://")) {
      targetUrl = `https://image.baidu.com/search/down?url=${targetUrl}`;
    }
    imageNode.src = targetUrl;
  });
};
