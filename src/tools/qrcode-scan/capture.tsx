import { createApp, onMounted, ref } from "vue";
import { createBlob } from "../../utils";
import { useEventListener } from "@vueuse/core";

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

const startCapture = async ({
  mediaStream,
}: {
  mediaStream: MediaStream;
}): Promise<string> => {
  const { element, removeElement } = addElement();

  return new Promise<string>((resolve, reject) => {
    const app = createApp({
      setup: () => {
        const videoRef = ref();
        const dialogRef = ref();

        useEventListener(window, "popstate", () => {
          dialogRef.value.close();
        });

        onMounted(() => {
          dialogRef.value.showModal();
          dialogRef.value.addEventListener("close", () => {
            if (dialogRef.value.returnValue) {
              resolve(dialogRef.value.returnValue);
            } else {
              reject(new Error("Cancel"));
            }
            close();
          });

          videoRef.value.srcObject = mediaStream;
        });

        const getMediaCapture = async () => {
          const blob = await createBlob(videoRef.value);
          const dataUrl = URL.createObjectURL(blob);
          dialogRef.value.close(dataUrl);
        };

        return () => (
          <dialog ref={dialogRef} class="modal modal-bottom sm:modal-middle">
            <form>
              <div class="modal-box">
                <h3 class="font-bold text-lg pb-4">截图</h3>
                <video muted ref={videoRef} autoplay></video>
                <div class="modal-action">
                  <button type="button" class="btn btn-primary" onClick={getMediaCapture}>
                    获取截图
                  </button>
                  <button
                    type="button"
                    class="btn border"
                    onClick={() => {
                      dialogRef.value.close();
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </form>
          </dialog>
        );
      },
    });

    const close = () => {
      app.unmount();
      removeElement();
    };
    app.mount(element);
  });
};

export default startCapture;
