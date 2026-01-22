import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import useAuthStore from "./store/useAuthStore";
import "./index.css";
import { router } from "./router";
import { registerSW } from "virtual:pwa-register";
import GlobalDialog from "./components/dialogs/global-dialog";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { queryClient } from "@packages/api-client";
import { createIDBPersister } from "./lib/queryPersister";

registerSW({ immediate: true });

// Create persister outside component to avoid recreating on each render
const persister = createIDBPersister();

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
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours - matches queryClient gcTime
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            // Only persist successful queries with data
            return query.state.status === 'success' && query.state.data !== undefined;
          },
        },
      }}
    >
      <AppRouter />
      <GlobalDialog />
    </PersistQueryClientProvider>
  </StrictMode>
);
