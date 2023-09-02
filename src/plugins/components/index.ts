import { Plugin } from "vue";
import Icon from "./Icon.vue";

const componentsPlugin: Plugin = {
  install: (app) => {
    app.component("t-icon", Icon);
  },
};

export default componentsPlugin;
