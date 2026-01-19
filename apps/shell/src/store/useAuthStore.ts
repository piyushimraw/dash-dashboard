import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  userId: string;
  isLoggedIn: boolean;
  login: (userId: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: "",
      isLoggedIn: false,

      login: (userId) =>
        set({
          userId,
          isLoggedIn: true,
        }),

      logout: () =>
        set({
          userId: "",
          isLoggedIn: false,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;
