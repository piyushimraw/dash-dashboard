import type { AuthService, AuthState, Role } from '@packages/mfe-types';
import useAuthStore from '../store/useAuthStore';

/**
 * Auth service implementation for MFEs to consume
 * Wraps Zustand store to implement AuthService interface
 */
export const authService: AuthService = {
  getState: (): AuthState => {
    const state = useAuthStore.getState();
    return {
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
    };
  },

  hasRole: (role: Role): boolean => {
    return useAuthStore.getState().hasRole(role);
  },

  hasAnyRole: (roles: Role[]): boolean => {
    return useAuthStore.getState().hasAnyRole(roles);
  },

  subscribe: (callback: (state: AuthState) => void): (() => void) => {
    return useAuthStore.subscribe((state) => {
      callback({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
      });
    });
  },

  // Note: login and logout are not exposed through the service interface
  // as they're meant to be called directly from the shell's login page.
  // MFEs should only read auth state, not modify it.
  login: async (email: string, password: string): Promise<void> => {
    const success = useAuthStore.getState().login(email, password);
    if (!success) {
      throw new Error('Invalid credentials');
    }
  },

  logout: async (): Promise<void> => {
    useAuthStore.getState().logout();
  },

  refresh: async (): Promise<void> => {
    // No-op for now - dummy auth doesn't need refresh
  },
};

// Re-export the store hook for components that need it
export { useAuthStore };
