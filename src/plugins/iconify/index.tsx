import { Plugin } from "vue";
import localIcons from "./local-icons"
import { Icon, addIcon } from '@iconify/vue';

Object.entries(localIcons).forEach(([key,values])=>{
  addIcon(key,values)
})

const plugin: Plugin = {
  install: (app) => {
    app.component("i-icon", Icon);
  },
};

export default plugin;
