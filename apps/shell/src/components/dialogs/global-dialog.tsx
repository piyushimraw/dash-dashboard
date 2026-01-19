"use client";

import { Dialog, DialogPortal } from "@dash/shared-ui";
import { useGlobalDialogStore } from "./useGlobalDialogStore";
import { mfeRegistry } from "@/lib/mfe-registry";

/**
 * GlobalDialog Component
 * - Always mounted at the root of your app (e.g., in `app/layout.tsx`).
 * - Listens to global dialog state via `useGlobalDialogStore`.
 * - Renders the appropriate dialog based on `type` by looking up the MFE registry.
 * - Click outside the dialog content closes it automatically.
 */
export default function GlobalDialog() {
  const { isOpen, type, props, closeDialog } = useGlobalDialogStore();

  // No dialog open → render nothing
  if (!isOpen || !type) return null;

  // Get the dialog component dynamically from the MFE registry
  const dialogDef = mfeRegistry.getDialog(type);
  if (!dialogDef) {
    console.warn(`Dialog type "${type}" not found in MFE registry`);
    return null;
  }

  const DialogComponent = dialogDef.component;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
      <DialogPortal>
        {/* ----- background effect ----- */}
        <div className="pointer-events-auto fixed inset-0 z-50 bg-black/60" />
        {/* ------- dialog content ------- */}
        <DialogComponent {...(props as object)} onClose={closeDialog} />
      </DialogPortal>
    </Dialog>
  );
}
