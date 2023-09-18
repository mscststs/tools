import * as rawModules from "./modules";
export { createLoader } from "./loader";

export const tools: Tool[] = Object.entries(rawModules).map(([, value]) => {
  return value;
});
