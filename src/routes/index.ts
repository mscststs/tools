import * as VueRouter from "vue-router";

import Home from "../views/Home.vue";
import Page404 from "../views/Page404.vue";
import Tools from "../views/Tools.vue";

import toolModules from "../tools";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/tools/",
    component: Tools,
    children: toolModules.map((tool) => {
      return {
        path: `${tool.id}`,
        name: tool.id,
        component: tool.component,
      };
    }),
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
