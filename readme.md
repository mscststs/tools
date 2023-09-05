## Tools

一个工具站 

> https://tools.mscststs.com

## dev

#### SVG 图标引入

所有的图标均由 `@iconify/vue` 进行渲染。
1. 对于来自 Iconify 托管的图标，使用 `src/plugins/iconify/ext-icons.ts` 进行本地导入并注册，使用 `ext:` 调用。
2. 对于本地图标或者第三方图标，使用 `src/plugins/iconify/local-icons.ts` 进行导入，使用 `local:` 调用。