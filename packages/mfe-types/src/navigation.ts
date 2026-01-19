import type { ComponentType } from "react";

export interface NavigationItem {
  label: string;
  icon?: ComponentType<{ className?: string }>;
  pathname?: string;
  children?: NavigationItem[];
}

export interface NavigationGroup {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  items: NavigationItem[];
  order: number;
}
