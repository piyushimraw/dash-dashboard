/**
 * MFE Types Package
 *
 * Shared TypeScript type definitions for microfrontend architecture.
 * Provides compile-time verification of contracts between shell and MFEs.
 */

// MFE Registry
export type {
  MfeLoadingState,
  MfeMetadata,
  MfeRegistry,
} from './mfe-registry';

// Authentication
export type {
  Role,
  User,
  AuthState,
  AuthService,
} from './auth';

// Navigation
export type {
  NavigationItem,
  NavigationGroup,
} from './navigation';

// Dialogs
export type {
  DialogSize,
  DialogDefinition,
  DialogState,
} from './dialog';
