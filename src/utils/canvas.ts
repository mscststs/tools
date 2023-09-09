export async function createBlob(element: HTMLImageElement | HTMLVideoElement) {
  let width = 0;
  let height = 0;

  if (element instanceof HTMLImageElement) {
    width = element.width;
    height = element.height;
  } else if (element instanceof HTMLVideoElement) {
    width = element.videoWidth;
    height = element.videoHeight;
  }

  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx?.drawImage(element, 0, 0);
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) {
        resolve(b);
      } else {
        reject(new Error("transform Error"));
      }
    });
  });
  return blob;
}