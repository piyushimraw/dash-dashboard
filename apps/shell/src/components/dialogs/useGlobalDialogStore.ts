import { create } from 'zustand';
/**
 * A central registry of all dialog types and the props they accept.
 *
 * Add new entries here as you create new dialogs.
 *
 * Example:
 *   interface DialogRegistry {
 *     LOGIN: { initialEmail?: string };
 *     PROFILE: { user: { name: string; email: string } };
 *     SETTINGS: { darkMode: boolean };
 *     // HELP: { topicId: string };   // ← example of adding another dialog
 *   }
 */
export interface DialogRegistry {
  RENT_VEHICLE: { 0?: '' }; //no props we are passing here
  // ... add more here as you go
}
type DialogType = keyof DialogRegistry | null;
interface DialogState {
  isOpen: boolean;
  type: DialogType;
  props: unknown;
  openDialog: <K extends keyof DialogRegistry>(type: K, props?: DialogRegistry[K]) => void;
  closeDialog: () => void;
}
export const useGlobalDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  type: null,
  props: null,
  openDialog: (type, props) => set({ isOpen: true, type, props }),
  closeDialog: () => set({ isOpen: false, type: null, props: null }),
}));
