type ToolTypes = "utils" | "transform" | "encode" | "visual";

interface Tool {
  id: string;
  name: string;
  icon: string;
  type: ToolTypes;
  component: RawRouteComponent;
}
