type ToolTypes = "utils" | "transform" | "encode" | "visual";

interface Dependencies {
  /**
   * 依赖名称，必须唯一
   */
  name: string;
  /**
   * 依赖类型
   */
  type: "js" | "css";
  /**
   * 依赖加载地址
   */
  url?: string;
  /**
   * 可以提供多个地址，作为备份，加载器会顺序尝试每个地址直到成功
   */
  urls?: string[];
  /**
   * 依赖的其他模块
   */
  dependencies?: Dependencies[];
}

interface Tool {
  /**
   * 工具ID，作为 路由的名字
   */
  id: string;
  /**
   * 工具名称
   */
  name: string;
  /**
   * 图表
   */
  icon: string;
  /**
   * 类型
   */
  type: ToolTypes;
  /**
   * 视图组件
   */
  component: RawRouteComponent;
  /**
   * 依赖项
   */
  dependencies?: Dependencies[];
}
