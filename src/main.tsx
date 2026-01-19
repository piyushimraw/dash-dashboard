import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import useAuthStore from "./store/useAuthStore";
import "./index.css";
import { router } from "./router";
import { registerSW } from "virtual:pwa-register";
import GlobalDialog from "./components/dialogs/global-dialog";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query/queryClient";

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
