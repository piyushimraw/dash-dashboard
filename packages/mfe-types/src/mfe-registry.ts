/**
 * MFE Registry Types
 *
 * Defines the metadata and lifecycle for microfrontends (MFEs) in the shell.
 */

export type MfeLoadingState =
  | 'idle'
  | 'loading'
  | 'loaded'
  | 'error';

export interface MfeMetadata {
  /** Unique identifier for the MFE */
  id: string;

  /** Display name shown in navigation */
  name: string;

  /** Route path where this MFE is mounted (e.g., '/rentals') */
  path: string;

  /** Roles allowed to access this MFE */
  allowedRoles: string[];

  /** Loading state of the MFE */
  state: MfeLoadingState;

  /** Error message if state is 'error' */
  error?: string;

  /** Optional icon identifier for navigation */
  icon?: string;

  /** Optional description for tooltips/help */
  description?: string;
}

export interface MfeRegistry {
  /** Register a new MFE */
  register(metadata: Omit<MfeMetadata, 'state'>): void;

  /** Unregister an MFE */
  unregister(id: string): void;

  /** Get all registered MFEs */
  getAll(): MfeMetadata[];

  /** Get a specific MFE by id */
  get(id: string): MfeMetadata | undefined;

  /** Update MFE loading state */
  updateState(id: string, state: MfeLoadingState, error?: string): void;

  /** Get MFEs available to a specific role */
  getByRole(role: string): MfeMetadata[];
}
