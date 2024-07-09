import { sleep } from ".";

/**
 * @description 给 Promise 添加超时时间
 * @param promise
 * @param timeout
 * @returns
 */
export const timeout = (promise: Promise<any> | (() => void), timeout = 3000) => {
  return Promise.race([
    (async () => {
      await sleep(timeout);
      throw new Error("Timeout");
    })(),
    typeof promise === "function" ? promise() : promise,
  ]);
};

export const anySuccess = async (cbs: (() => void)[]) => {
  let lastE = null;
  for (const item of cbs) {
    try {
      const res = await item();
      return res;
    } catch (e) {
      lastE = e;
    }
  }
  throw lastE;
};
