import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { useAuthStore, queryClient } from "@dash/shared-state";
import "./index.css";
import { router } from "./router";
import { registerSW } from "virtual:pwa-register";
import GlobalDialog from "./components/dialogs/global-dialog";
import { QueryClientProvider } from "@tanstack/react-query";

// MFE Registration
import { mfeRegistry } from "./lib/mfe-registry";
import {
  navigation as rentalsNavigation,
  dialogs as rentalsDialogs,
} from "@dash/mfe-rentals";
import { navigation as returnsNavigation } from "@dash/mfe-returns";
import { navigation as aaoNavigation } from "@dash/mfe-aao";

// Register MFEs
mfeRegistry.register({
  id: "rentals",
  navigation: rentalsNavigation,
  dialogs: rentalsDialogs,
});

mfeRegistry.register({
  id: "returns",
  navigation: returnsNavigation,
});

mfeRegistry.register({
  id: "aao",
  navigation: aaoNavigation,
});

registerSW({ immediate: true });

function AppRouter() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <RouterProvider
      router={router}
      context={{
        auth: {
          isLoggedIn,
        },
      }}
    />
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <GlobalDialog />
    </QueryClientProvider>
  </StrictMode>
);
