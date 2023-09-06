import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import directives from "./plugins/directives";
import iconify from "./plugins/iconify";
import router from "./routes";

const app = createApp(App);

app.use(directives);
app.use(iconify);
app.use(router);

app.mount("#app");
