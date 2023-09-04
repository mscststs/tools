import * as VueRouter from "vue-router";

import Home from "../views/Home.vue";
import Page404 from "../views/Page404.vue";
import Tools from "../views/Tools.vue";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/Tools/:name",
    component: Tools,
  },
  {
    path: "/:catchAll(.*)",
    component: Page404,
  },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes, // `routes: routes` 的缩写
});

export default router;
