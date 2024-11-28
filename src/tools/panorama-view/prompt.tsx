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

const prompt = async (title = ""): Promise<any> => {
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
              resolve(dialogRef.value.returnValue);
            } else {
              reject(new Error("Cancel"));
            }
            close();
          });
        });

        const confirm = async () => {
          const formData = new FormData(formRef.value);
          const input = formData.get("input");

          dialogRef.value.close(input);
        };

        return () => (
          <dialog ref={dialogRef} class="modal modal-bottom sm:modal-middle">
            <form
              class="min-w-[400px]"
              ref={formRef}
              onKeydown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  confirm();
                }
              }}
            >
              <div class="modal-box ">
                <h3 class="font-bold text-lg pb-4">{title || "请输入"}</h3>
                <div class="form-control flex-col flex gap-4">
                  <input type="text" placeholder="" class="input input-bordered w-full max-w-xs" name="input" />
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
