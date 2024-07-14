import { createApp, onMounted, ref } from "vue";
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

const prompt = async (): Promise<any> => {
  const { element, removeElement } = addElement();

  return new Promise<any>((resolve, reject) => {
    const app = createApp({
      setup: () => {
        const dialogRef = ref();
        const formRef = ref();

        useEventListener(window, "popstate", () => {
          dialogRef.value.close();
        });

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

        const confirm = async (e: Event) => {
          e.preventDefault();
          const formData = new FormData(formRef.value);
          const facingMode = formData.get("facingMode");
          const audio = formData.get("audio") === "1";

          if (facingMode) {
            dialogRef.value.close(JSON.stringify({ facingMode, audio }));
          } else {
            dialogRef.value.close();
          }
        };

        return () => (
          <dialog ref={dialogRef} class="modal modal-bottom sm:modal-middle">
            <form class="w-full flex flex-row justify-center" ref={formRef} onSubmit={confirm}>
              <div class="modal-box ">
                <h3 class="font-bold text-lg pb-4">选择模式：</h3>
                <div class="form-control flex-col flex gap-4">
                  <select class="select select-primary max-w-xs" name="facingMode" required>
                    <option disabled>摄像头</option>
                    <option value="user" selected>
                      前置摄像头
                    </option>
                    <option value="environment">后置摄像头</option>
                  </select>
                  <select class="select select-primary max-w-xs" name="audio" required>
                    <option disabled>语音</option>
                    <option value="1" selected>
                      打开语音
                    </option>
                    <option value="0">关闭语音</option>
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
