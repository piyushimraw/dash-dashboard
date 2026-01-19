import type { AnyRoute } from "@tanstack/react-router";

export interface MFERouteDefinition {
  path: string;
  component: React.ComponentType;
}

export interface MFERoutesExport {
  createRoutes: (parentRoute: AnyRoute) => AnyRoute[];
}
