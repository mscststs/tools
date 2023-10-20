import { addElement, anySuccess } from "../utils";
import { ref, Ref } from "vue";

const dependenciesLoadStatus: Record<string, boolean> = {};

async function loadDependencies(dependencies: Dependencies[], loadStatus: Ref<string>) {
  if (dependencies?.length) {
    await Promise.all(
      dependencies.map(async (dependency) => {
        if (dependenciesLoadStatus[dependency.name]) {
          return true;
        } else {
          if (dependency.dependencies) {
            await loadDependencies(dependency.dependencies, loadStatus);
          }

          const urls = dependency.urls?.length ? dependency.urls : [dependency.url];

          loadStatus.value = `正在加载: ${dependency.name}`;
          await anySuccess(
            urls.map((url) => {
              if (dependency.type === "js") {
                return () => addElement("script", { src: url });
              } else {
                return () =>
                  addElement("link", {
                    rel: "stylesheet",
                    href: url,
                  });
              }
            }),
          );

          dependenciesLoadStatus[dependency.name] = true;
        }
      }),
    );
  }
}

export function createLoader(module: Tool) {
  const loadStatus = ref("");
  const loader = async function () {
    const { component, dependencies } = module;

    // 检查 dependencies
    if (dependencies?.length) {
      await loadDependencies(dependencies, loadStatus);
    }

    loadStatus.value = `正在加载: ${module.name}`;
    return await component();
  };
  return { loader, loadStatus };
}
