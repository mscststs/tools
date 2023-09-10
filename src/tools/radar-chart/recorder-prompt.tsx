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

const prompt = async (): Promise<any> => {
  const { element, removeElement } = addElement();

  return new Promise<any>((resolve, reject) => {
    const app = createApp({
      setup: () => {
        const codecsList = [
          "video/webm;codecs=av01",
          "video/webm;codecs=avc1",
          "video/webm;codecs=h265",
          "video/webm;codecs=h264",
          "video/webm;codecs=vp9",
          "video/webm;codecs=vp8",

          "video/mp4;codecs=h265",
          "video/mp4;codecs=h264",
          "video/mp4;codecs=avc1",
        ];

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
          const speed = formData.get("speed");
          const fps = formData.get("fps");

          if (codecs && rate) {
            dialogRef.value.close(
              JSON.stringify({
                mimeType: codecs,
                videoBitsPerSecond: rate,
                speed,
                fps,
              }),
            );
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
                  <select class="select select-primary max-w-xs" name="speed" required>
                    <option disabled>播放速度</option>
                    <option value="1000">1 张/s</option>
                    <option value="500">2 张/s</option>
                    <option value="200">5 张/s</option>
                    <option value="100" selected>
                      10 张/s
                    </option>
                    <option value="50">20 张/s</option>
                    <option value="33">30 张/s</option>
                    <option value="16">60 张/s</option>
                  </select>
                  <select class="select select-primary max-w-xs" name="fps" required>
                    <option disabled>帧率</option>
                    <option value="10">10fps</option>
                    <option value="30" selected>
                      30fps
                    </option>
                    <option value="60">60fps</option>
                  </select>
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
                    <option value="41943040">5M</option>
                    <option value="83886080">10M</option>
                    <option value="125829120" selected>
                      15M
                    </option>
                    <option value="167772160">20M</option>
                    <option value="209715200">25M</option>
                    <option value="335544320">40M</option>
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
