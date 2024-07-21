import { AutoProcessor, AutoModel, Tensor, env, RawImage } from "/lib/transformers.min.js";
// transformerjs#v3

const DEVICE = navigator.gpu ? "webgpu" : "wasm";

env.allowLocalModels = false;
env.backends.onnx.wasm.proxy = DEVICE !== "webgpu";

/**
 * This class uses the Singleton pattern to ensure that only one instance of the
 * pipeline is loaded. This is because loading the pipeline is an expensive
 * operation and we don't want to do it every time we want to translate a sentence.
 */

let model;
let processor;

function postMessage(type, data) {
  self.postMessage({
    eventType: type,
    eventData: data,
  });
}

function progress_callback(e) {
  postMessage(e.status, {
    progress: Number.parseInt(e.progress),
  });
}

async function getInstance(width = 1024, height = 1024) {
  if (!model) {
    try {
      model = await AutoModel.from_pretrained("briaai/RMBG-1.4", {
        config: {
          model_type: "custom",
        },
        device: DEVICE,
        dtype: "fp32",
        quantized: !1,
        progress_callback,
      });
    } catch (e) {
      postMessage("loaderr");
      throw e;
    }
  }

  if (!processor) {
    processor = await AutoProcessor.from_pretrained("briaai/RMBG-1.4", {
      config: {
        do_normalize: true,
        do_pad: false,
        do_rescale: true,
        do_resize: true,
        image_mean: [0.5, 0.5, 0.5],
        feature_extractor_type: "ImageFeatureExtractor",
        image_std: [1, 1, 1],
        resample: 2,
        rescale_factor: 0.00392156862745098,
        size: {
          width,
          height,
        },
      },
      progress_callback,
    });
  }

  return {
    model,
    processor,
  };
}
async function warmup() {
  const { model } = await getInstance();
  postMessage("warmup");
  const [b, c, h, w] = [1, 3, 1024, 1024];
  const dummyData = new Float32Array(b * c * h * w);
  await model({
    input: new Tensor("float32", dummyData, [b, c, h, w]),
  });
  postMessage("ready");
}
warmup();

self.addEventListener("message", async (event) => {
  const { eventType, eventData } = event.data;
  if (eventType === "evalute") {
    postMessage("startEvalute");
    const url = eventData;
    const timeStart = performance.now();
    const e = await RawImage.fromURL(url);
    const { model, processor } = await getInstance();
    const { pixel_values: n } = await processor(e);
    const s = performance.now();
    const { output: d } = await model({
      input: n,
    });

    const r = await RawImage.fromTensor(d[0].mul(255).to("uint8")).resize(e.width, e.height);

    const canvas = new OffscreenCanvas(e.width, e.height);
    const context = canvas.getContext("2d");
    context.drawImage(e.toCanvas(), 0, 0);

    const p = context.getImageData(0, 0, e.width, e.height);
    for (let m = 0; m < r.data.length; ++m) {
      p.data[4 * m + 3] = r.data[m];
    }
    context.putImageData(p, 0, 0);
    const result = await canvas.convertToBlob({
      type: "image/png",
    });

    const duration = Number.parseInt(performance.now() - timeStart);

    postMessage("finishEvalute", {
      result,
      duration,
    });
  }
});
