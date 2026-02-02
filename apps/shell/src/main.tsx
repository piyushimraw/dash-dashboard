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
import { AppErrorBoundary } from "./components/error-boundary/AppErrorBoundary";
import { Toaster, ToastProvider } from "@packages/ui";
// import { ErrorTester } from "./components/error-boundary/ErrorTester";

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
    <AppErrorBoundary>
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
        <ToastProvider>
          {/* {import.meta.env.DEV && (
            <ErrorTester level="app" />
          )} */}
        <AppRouter />
        <GlobalDialog />
        <Toaster />
        </ToastProvider>
      </PersistQueryClientProvider>
    </AppErrorBoundary>
  </StrictMode>
);
