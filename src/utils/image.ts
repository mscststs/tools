export const getImage = async (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const imageNode = new Image();
    imageNode.onerror = reject;
    imageNode.onload = () => {
      resolve(imageNode);
    };
    imageNode.crossOrigin = "anonymous";
    imageNode.src = url;
  });
};
