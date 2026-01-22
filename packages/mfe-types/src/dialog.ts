/**
 * Dialog Types
 *
 * Defines the dialog/modal system for cross-MFE communication.
 * MFEs can request the shell to show dialogs from other MFEs.
 */

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DialogDefinition {
  /** Unique identifier for this dialog */
  id: string;

  /** Title shown in dialog header */
  title: string;

  /** Dialog size */
  size?: DialogSize;

  /** Whether clicking outside closes the dialog */
  closeOnOutsideClick?: boolean;

  /** Whether the dialog can be closed (shows close button) */
  closeable?: boolean;

  /** Component to render (MFE-specific) */
  component: string;

  /** Props to pass to the component */
  props?: Record<string, unknown>;
}

export interface DialogState {
  /** Whether the dialog is open */
  isOpen: boolean;

  /** The active dialog definition (null if closed) */
  dialog: DialogDefinition | null;

  /** Result data when dialog closes */
  result?: unknown;
}
