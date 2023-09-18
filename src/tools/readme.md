## 工具开发流程

### 创建
1. 创建文件夹，创建 index.vue ， 并且创建 index.ts，参考其他工具导出相应的模块
2. 在 modules.ts 中导出新创建的工具文件


### 依赖
1. 全局可用的模块可以直接使用 ESM 导入，走编译流程打包到源码
2. 偶尔使用/体积非常大的模块，可以使用 dependencies 的方式导入
  1. 在插件中定义 dependencies 相关的选项，建议将 dependencies 都统一写在 `dependencies.ts`，然后在插件中导入
  2. 路由跳转之前使用loader加载对应的组件和依赖，依赖及其祖先依赖会先加载，然后才会加载视图模块
  3. 建议使用 `dependencies.urls` 提供依赖的多个导入地址，避免单一 CDN 不通导致功能不可用，对于体积不大的依赖，可以在 `public/lib` 下存一份

