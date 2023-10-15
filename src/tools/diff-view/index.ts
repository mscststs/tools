export const diffView: Tool = {
  id: "diff-view",
  name: "Diff 视图",
  icon: "ext:diffwiew",
  type: "utils",
  component: () => import("./index.vue"),
};
