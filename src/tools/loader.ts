import { addElement, anySuccess } from "../utils";

const dependenciesLoadStatus: Record<string, boolean> = {};

async function loadDependencies(dependencies: Dependencies[]) {
  if (dependencies?.length) {
    await Promise.all(
      dependencies.map(async (dependency) => {
        if (dependenciesLoadStatus[dependency.name]) {
          return true;
        } else {
          if (dependency.dependencies) {
            await loadDependencies(dependency.dependencies);
          }

          const urls = dependency.urls?.length ? dependency.urls : [dependency.url];

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
  return async function () {
    const { component, dependencies } = module;

    // 检查 dependencies
    if (dependencies?.length) {
      await loadDependencies(dependencies);
    }

    return await component();
  };
}
