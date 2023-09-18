// 类型 Options 的类型为 ：HTMLElement 上所有非只读的属性和方法
type Options = {
  [key: string]: any;
};

export function addElement(tag = "script", options: Options = {}, parent = document.body) {
  const ele = document.createElement(tag);
  Object.entries(options).forEach(([key, val]) => {
    if (!["onload", "onerror"].includes(key)) {
      ele.setAttribute(key, val);
    }
  });

  parent.appendChild(ele);

  return new Promise((resolve, reject) => {
    ele.onload = (...args) => {
      resolve(...args);
      options?.onload?.(...args);
    };
    ele.onerror = (...args) => {
      reject(new Error("Script load error"));
      options?.onerror?.(...args);
    };
  });
}
