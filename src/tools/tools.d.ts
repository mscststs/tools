type ToolTypes = "utils" | "transform" | "encode";

interface Tool {
  id: string;
  name: string;
  icon: string;
  type: ToolTypes;
  component: RawRouteComponent;
}
