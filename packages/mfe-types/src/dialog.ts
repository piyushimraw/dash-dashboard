import type { ComponentType } from "react";

export interface DialogDefinition<P = unknown> {
  id: string;
  component: ComponentType<P & { onClose: () => void }>;
}

export interface DialogState {
  isOpen: boolean;
  type: string | null;
  props: unknown;
  openDialog: (type: string, props?: unknown) => void;
  closeDialog: () => void;
}
