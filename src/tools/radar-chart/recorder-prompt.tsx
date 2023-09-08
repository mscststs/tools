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

const prompt = async (): Promise<MediaRecorderOptions> => {
  const { element, removeElement } = addElement();

  return new Promise<MediaRecorderOptions>((resolve, reject) => {
    const app = createApp({
      setup: () => {
        const codecsList = ["video/webm;codecs=h264", "video/webm;codecs=av1", "video/webm;codecs=vp9"];

        const dialogRef = ref();
        const formRef = ref();

        onMounted(() => {
          dialogRef.value.showModal();
          dialogRef.value.addEventListener("close", () => {
            if (dialogRef.value.returnValue) {
              resolve(JSON.parse(dialogRef.value.returnValue));
            } else {
              reject(new Error("Cancel"));
            }
            close();
          });
        });

        const confirm = async () => {
          const formData = new FormData(formRef.value);
          const codecs = formData.get("codecs");
          const rate = formData.get("rate");

          if (codecs && rate) {
            dialogRef.value.close(JSON.stringify({ mimeType: codecs, videoBitsPerSecond: rate }));
          } else {
            dialogRef.value.close();
          }
        };

        return () => (
          <dialog ref={dialogRef} class="modal modal-bottom sm:modal-middle">
            <form class="min-w-[400px]" ref={formRef}>
              <div class="modal-box ">
                <h3 class="font-bold text-lg pb-4">选择编码器和码率</h3>
                <div class="form-control flex-col flex gap-4">
                  <select class="select select-primary max-w-xs" name="codecs" required>
                    <option disabled selected>
                      编码器
                    </option>
                    {codecsList.map((item) => {
                      return (
                        <option key={item} disabled={!MediaRecorder.isTypeSupported(item)}>
                          {item}
                        </option>
                      );
                    })}
                  </select>

                  <select class="select select-primary max-w-xs" name="rate" required>
                    <option disabled>码率</option>
                    <option value="10000000">10M</option>
                    <option value="15000000">15M</option>
                    <option value="20000000">20M</option>
                    <option value="100000000" selected>
                      100M
                    </option>
                    <option value="200000000">200M</option>
                  </select>
                </div>
                <div class="modal-action">
                  <button type="button" class="btn btn-primary" onClick={confirm}>
                    确定
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

export default prompt;
