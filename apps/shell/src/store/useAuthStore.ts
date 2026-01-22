import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role, User, AuthState } from '@packages/mfe-types';
import { DUMMY_USERS } from "../config/users";
import { ROLE_HIERARCHY } from "../config/roles";

interface AuthStore extends AuthState {
  // Actions
  login: (username: string, password: string) => boolean;
  logout: () => void;
  // Role checks
  hasRole: (role: Role) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
  // For router context (legacy compatibility)
  userId: string;
  role: Role | null;
  isLoggedIn: boolean;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      userId: "",
      role: null,
      isLoggedIn: false,

      // Actions
      login: (username, password) => {
        const dummyUser = DUMMY_USERS.find(
          (u) => u.username === username && u.password === password
        );

        if (!dummyUser) return false;

        const user: User = {
          id: dummyUser.username,
          username: dummyUser.username,
          role: dummyUser.role,
        };

        set({
          user,
          isAuthenticated: true,
          isLoggedIn: true,
          userId: user.username,
          role: user.role,
        });

        return true;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoggedIn: false,
          userId: "",
          role: null,
        });
      },

      // Role checks
      hasRole: (role) => {
        const currentRole = get().role;
        if (!currentRole) return false;
        return ROLE_HIERARCHY[currentRole] >= ROLE_HIERARCHY[role];
      },

      hasAnyRole: (roles) => {
        const currentRole = get().role;
        if (!currentRole) return false;
        return roles.some((role) => ROLE_HIERARCHY[currentRole] >= ROLE_HIERARCHY[role]);
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoggedIn: state.isLoggedIn,
        userId: state.userId,
        role: state.role,
      }),
    }
  )
);

export default useAuthStore;