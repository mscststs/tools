/**
 * @description 时间格式化
 * @param {Date} date
 * @param {string} fmt
 */
export function formatTime(date = new Date(), fmt = "YYYY-MM-DD HH:mm:ss") {
  let result = fmt;
  const o: {
    [key: string]: any;
  } = {
    "M+": date.getMonth() + 1,
    "D+": date.getDate(),
    "h+": date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    "H+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  };
  const week: {
    [key: string]: any;
  } = {
    0: "\u65e5",
    1: "\u4e00",
    2: "\u4e8c",
    3: "\u4e09",
    4: "\u56db",
    5: "\u4e94",
    6: "\u516d",
  };
  if (/(Y+)/.test(result)) {
    result = result.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(result)) {
    result = result.replace(
      RegExp.$1,
      (RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[`${date.getDay()}`],
    );
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(result)) {
      result = result.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length));
    }
  }
  return result;
}

/**
 * @description 等待
 * @param ms 毫秒
 * @returns
 */
export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * @description 给 Promise 添加超时时间
 * @param promise
 * @param timeout
 * @returns
 */
export const timeout = (promise: Promise<any> | Function, timeout = 3000) => {
  return Promise.race([
    (async () => {
      await sleep(timeout);
      throw new Error("Timeout");
    })(),
    typeof promise === "function" ? promise() : promise,
  ]);
};
