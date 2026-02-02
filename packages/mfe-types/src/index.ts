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

// BFF (OpenAPI-generated) types — compatibility exports
// The codegen produces a `components` interface. For convenience and
// backwards compatibility with earlier hand-written types, we expose a
// small set of commonly used type aliases here.
import type { components as _BffComponents } from './generated/bff'
export type RentedVehicle = _BffComponents['schemas']['RentedVehicle']
export type GetRentedVehiclesResponse = RentedVehicle[]
