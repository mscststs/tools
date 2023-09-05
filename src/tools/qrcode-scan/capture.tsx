import { createApp, onMounted, ref } from "vue";

const addElement = () => {
  const div = document.createElement("div");
  document.body.appendChild(div);
  return {
    element: div,
    removeElement: () => {
      document.body.removeChild(div);
    },
  };
};

const startCapture = async (mediaStream: MediaStream): Promise<string> => {
  const { element, removeElement } = addElement();

  const close = () => {
    app.unmount();
    removeElement();
  };

  let resolve: Function | null = null;
  let reject: Function | null = null;
  const pr = new Promise<string>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  const handleResolve = (value: any) => {
    resolve?.(value);
    close();
  };
  const handleReject = (err: Error) => {
    reject?.(err);
    close();
  };

  const app = createApp({
    setup: () => {
      const videoRef = ref();
      const dialogRef = ref();

      onMounted(() => {
        dialogRef.value.showModal();
        dialogRef.value.addEventListener("close", handleReject);

        videoRef.value.srcObject = mediaStream;
      });

      const getMediaCapture = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.value.videoWidth;
        canvas.height = videoRef.value.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(videoRef.value, 0, 0);
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => {
            if (b) {
              resolve(b);
            } else {
              reject(new Error("transform Error"));
            }
          });
        });
        const dataUrl = URL.createObjectURL(blob);
        handleResolve(dataUrl);
      };

      return () => (
        <dialog ref={dialogRef} class="modal modal-bottom sm:modal-middle">
          <div class="modal-box">
            <h3 class="font-bold text-lg">截图</h3>

            <video muted ref={videoRef} autoplay></video>
            <div class="modal-action">
              <button type="button" class="btn btn-neutral" onClick={getMediaCapture}>
                获取截图
              </button>
              <button type="button" class="btn" onClick={() => dialogRef.value.close()}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      );
    },
  });

  app.mount(element);
  return pr;
};

export default startCapture;
