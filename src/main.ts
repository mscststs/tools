import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import iconify from "./plugins/iconify";
import router from "./routes";

const app = createApp(App);

app.use(iconify);
app.use(router);

app.mount("#app");
