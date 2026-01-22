/**
 * Authentication Types
 *
 * Defines the authentication service interface and related types
 * shared between shell and MFEs.
 */

export type Role = 'counter_agent' | 'system_admin' | 'fleet_manager' | 'super_admin';

export interface User {
  /** Unique user identifier */
  id: string;

  /** User's username */
  username: string;

  /** User's assigned role */
  role: Role;
}

export interface AuthState {
  /** Whether the user is authenticated */
  isAuthenticated: boolean;

  /** Currently authenticated user (null if not authenticated) */
  user: User | null;

  /** Whether authentication is being checked/loaded */
  isLoading: boolean;
}

export interface AuthService {
  /** Get current authentication state */
  getState(): AuthState;

  /** Subscribe to authentication state changes */
  subscribe(callback: (state: AuthState) => void): () => void;

  /** Login with credentials */
  login(email: string, password: string): Promise<void>;

  /** Logout current user */
  logout(): Promise<void>;

  /** Check if user has specific role */
  hasRole(role: Role): boolean;

  /** Check if user has any of the specified roles */
  hasAnyRole(roles: Role[]): boolean;

  /** Refresh authentication token */
  refresh(): Promise<void>;
}
