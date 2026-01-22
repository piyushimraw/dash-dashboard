import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DUMMY_USERS } from "../config/users";
import type { Role } from "../config/roles";


interface AuthState {
  userId: string;
  role: Role | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: "",
      role: null,
      isLoggedIn: false,

      login: (username, password) => {
        const user = DUMMY_USERS.find(
          (u) => u.username === username && u.password === password
        );

        if (!user) return false;

        set({
          userId: user.username,
          role: user.role,
          isLoggedIn: true,
        });

        return true;
      },

      logout: () =>
        set({
          userId: "",
          role: null,
          isLoggedIn: false,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;