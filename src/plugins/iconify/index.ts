import { Plugin } from "vue";
import localIcons from "./local-icons";
import * as extIcons from "./ext-icons";
import { Icon, addIcon } from "@iconify/vue";

Object.entries(localIcons).forEach(([key, values]) => {
  addIcon(`local:${key}`, values);
});

Object.entries(extIcons).forEach(([key, values]) => {
  addIcon(`ext:${key}`, values);
});

const plugin: Plugin = {
  install: (app) => {
    app.component("i-icon", Icon);
  },
};

export default plugin;
