/**
 * MFE Registry Service
 *
 * Centralized registry for all microfrontends with metadata and loading state tracking.
 * Provides utilities for route matching and role-based access control.
 */

import type { MfeMetadata, MfeLoadingState } from '@packages/mfe-types';
import { create } from 'zustand';

/**
 * MFE Loading State Store
 * Tracks loading state for each MFE using Zustand
 */
interface MfeLoadingStoreState {
  loadingStates: Record<string, MfeLoadingState>;
  errors: Record<string, string | undefined>;
  setLoading: (id: string, state: MfeLoadingState, error?: string) => void;
  getState: (id: string) => MfeLoadingState;
  getError: (id: string) => string | undefined;
}

export const useMfeLoadingStore = create<MfeLoadingStoreState>((set, get) => ({
  loadingStates: {},
  errors: {},

  setLoading: (id: string, state: MfeLoadingState, error?: string) => {
    set((prev) => ({
      loadingStates: { ...prev.loadingStates, [id]: state },
      errors: { ...prev.errors, [id]: error },
    }));
  },

  getState: (id: string) => {
    return get().loadingStates[id] || 'idle';
  },

  getError: (id: string) => {
    return get().errors[id];
  },
}));

/**
 * MFE Registry
 * Metadata for all 9 MFEs in the application
 */
export const mfeRegistry: Omit<MfeMetadata, 'state' | 'error'>[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    path: '/dashboard',
    allowedRoles: ['counter_agent', 'system_admin', 'fleet_manager', 'super_admin'],
    icon: 'dashboard',
    description: 'Main dashboard with overview and quick actions',
  },
  {
    id: 'rent',
    name: 'Rent',
    path: '/rent',
    allowedRoles: ['counter_agent', 'super_admin'],
    icon: 'car',
    description: 'Process new vehicle rental transactions',
  },
  {
    id: 'return',
    name: 'Return',
    path: '/return',
    allowedRoles: ['counter_agent', 'super_admin'],
    icon: 'clipboardList',
    description: 'Process vehicle return transactions',
  },
  {
    id: 'vehicle_exchange',
    name: 'Vehicle Exchange',
    path: '/vehicle_exchange',
    allowedRoles: ['counter_agent', 'super_admin'],
    icon: 'car',
    description: 'Exchange vehicle during active rental',
  },
  {
    id: 'aao',
    name: 'AAO',
    path: '/aao',
    allowedRoles: ['counter_agent', 'super_admin'],
    icon: 'fileText',
    description: 'Additional Authorized Operator management',
  },
  {
    id: 'carcontrol',
    name: 'Car Control',
    path: '/carcontrol',
    allowedRoles: ['fleet_manager', 'super_admin'],
    icon: 'car',
    description: 'Vehicle check-in and check-out operations',
  },
  {
    id: 'reports',
    name: 'Reports',
    path: '/reports',
    allowedRoles: ['fleet_manager', 'super_admin'],
    icon: 'barChart',
    description: 'View daily summaries and revenue reports',
  },
  {
    id: 'settings',
    name: 'Settings',
    path: '/settings',
    allowedRoles: ['system_admin', 'super_admin'],
    icon: 'settings',
    description: 'System configuration and preferences',
  },
  {
    id: 'reservation_lookup',
    name: 'Reservation Lookup',
    path: '/reservation_lookup',
    allowedRoles: ['counter_agent', 'system_admin', 'fleet_manager', 'super_admin'],
    icon: 'search',
    description: 'Search and view reservation details',
  },
];

/**
 * Get MFE by route path
 * Matches exact paths and path prefixes
 */
export function getMfeByRoute(path: string): Omit<MfeMetadata, 'state' | 'error'> | undefined {
  // Normalize path (remove trailing slash if any)
  const normalizedPath = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;

  // Try exact match first
  const exactMatch = mfeRegistry.find((mfe) => mfe.path === normalizedPath);
  if (exactMatch) return exactMatch;

  // Try prefix match (for nested routes like /dashboard/overview)
  const prefixMatch = mfeRegistry.find(
    (mfe) => normalizedPath.startsWith(mfe.path + '/') || normalizedPath === mfe.path,
  );

  return prefixMatch;
}

/**
 * Check if MFE is enabled for given role
 */
export function isMfeEnabled(mfeId: string, userRole: string): boolean {
  const mfe = mfeRegistry.find((m) => m.id === mfeId);
  if (!mfe) return false;

  return mfe.allowedRoles.includes(userRole);
}

/**
 * Get all MFEs available to a specific role
 */
export function getMfesByRole(role: string): Omit<MfeMetadata, 'state' | 'error'>[] {
  // super_admin sees everything
  if (role === 'super_admin') {
    return mfeRegistry;
  }

  return mfeRegistry.filter((mfe) => mfe.allowedRoles.includes(role));
}

/**
 * Get MFE with current loading state
 */
export function getMfeWithState(mfeId: string): MfeMetadata | undefined {
  const mfe = mfeRegistry.find((m) => m.id === mfeId);
  if (!mfe) return undefined;

  const state = useMfeLoadingStore.getState().getState(mfeId);
  const error = useMfeLoadingStore.getState().getError(mfeId);

  return {
    ...mfe,
    state,
    error,
  };
}
