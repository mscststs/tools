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

        const confirm = async (e: Event) => {
          e.preventDefault();
          const formData = new FormData(formRef.value);
          const peerid = formData.get("peerid");

          if (peerid) {
            dialogRef.value.close(JSON.stringify({ peerid }));
          } else {
            dialogRef.value.close();
          }
        };

        return () => (
          <dialog ref={dialogRef} class="modal modal-bottom sm:modal-middle">
            <form class="w-full flex flex-row justify-center" ref={formRef} onSubmit={confirm}>
              <div class="modal-box ">
                <h3 class="font-bold text-lg pb-4">输入对端的 PeerId </h3>
                <div class="form-control flex-col flex gap-4">
                  <input type="text" class="input input-bordered" name="peerid" />
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
