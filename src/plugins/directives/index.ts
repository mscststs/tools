import { Plugin } from "vue";
import autofocus from "./autofocus";
import fakefocus from "./fakefocus";

const directiveLoader: Plugin = {
  install: (app) => {
    app.use(autofocus);
    app.use(fakefocus);
  },
};

export default directiveLoader;
