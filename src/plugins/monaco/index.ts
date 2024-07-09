import { type Plugin, defineAsyncComponent } from "vue";
import { loader } from "@guolao/vue-monaco-editor";
loader.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs",
  },
});

const EditorComponent = defineAsyncComponent(() => import("./Editor.ts"));
const DiffEditorComponent = defineAsyncComponent(() => import("./DiffEditor.ts"));

const plugin: Plugin = {
  install: (app) => {
    app.component("Editor", EditorComponent);
    app.component("DiffEditor", DiffEditorComponent);
  },
};

export default plugin;
