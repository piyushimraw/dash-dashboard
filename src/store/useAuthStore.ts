import React from "react";

// Shim for React 17
if (!(React as any).useSyncExternalStore) {
  (React as any).useSyncExternalStore = function () {
    // This is just a dummy function; Zustand will fallback internally
    console.warn("useSyncExternalStore is not supported in React 17");
    return undefined;
  };
}

import { create } from "zustand";
import { persist } from "zustand/middleware";

//Trick Zustand into not using useSyncExternalStore in React 17: 
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
