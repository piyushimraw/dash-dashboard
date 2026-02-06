'use client';

import { Dialog, DialogPortal } from '../ui/dialog';
import { type DialogRegistry, useGlobalDialogStore } from './useGlobalDialogStore';
import RentNewVehicleDialog from './rent-new-vehicle';

/**
 * `DialogMap` defines all available dialog components.
 * - The keys must match the keys in `DialogRegistry`.
 * - Each dialog receives its defined props (from `DialogRegistry`) plus an `onClose` callback.
 */
const DialogMap: {
  [K in keyof DialogRegistry]: React.ComponentType<DialogRegistry[K] & { onClose: () => void }>;
} = {
  RENT_VEHICLE: RentNewVehicleDialog,
};

/**
 * GlobalDialog Component
 * - Always mounted at the root of your app (e.g., in `app/layout.tsx`).
 * - Listens to global dialog state via `useGlobalDialogStore`.
 * - Renders the appropriate dialog based on `type` and passes props.
 * - Click outside the dialog content closes it automatically.
 */
export default function GlobalDialog() {
  const { isOpen, type, props, closeDialog } = useGlobalDialogStore();

  // No dialog open → render nothing
  if (!isOpen || !type) return null;

  // Get the dialog component dynamically from the registry
  const DialogComponent = DialogMap[type as keyof DialogRegistry];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
      <DialogPortal>
        {/* ----- background effect ----- */}
        <div className="pointer-events-auto fixed inset-0 z-50 bg-black/60" />
        {/* ------- dialog content ------- */}
        <DialogComponent {...(props as DialogRegistry[typeof type])} onClose={closeDialog} />
      </DialogPortal>
    </Dialog>
  );
}

/**
 * Example Usage: Open dialog anywhere in the app
 *
 * import { useGlobalDialogStore } from "@/store/dialog";
 *
 * const { openDialog } = useGlobalDialogStore();
 *
 * <button
 *   onClick={() =>
 *     openDialog("ONBOARDING_INFO", { user: { name: "Abu", email: "abu@test.com" } })
 *   }
 * >
 *   Open Onboarding Dialog
 * </button>
 *
 * Notes:
 * - The first argument of `openDialog` must match a key in `DialogRegistry`.
 * - The second argument must conform to the props type defined in `DialogRegistry`.
 * - Dialog components always receive an `onClose` callback to close themselves.
 */
