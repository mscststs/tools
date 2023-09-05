import * as rawModules from "./modules";

const moduleArray: Tool[] = Object.entries(rawModules).map(([, value]) => {
  return value;
});

export default moduleArray;
