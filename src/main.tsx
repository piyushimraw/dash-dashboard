import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import useAuthStore from "./store/useAuthStore";
import "./index.css";
import { router } from "./router";
import { hertzTheme, ThemeProvider , getTheme } from "@revlab/highlander-ui";

function AppRouter() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <RouterProvider
      router={router}
      context={
        {
          auth: {
            isLoggedIn,
          },
        }
      }
    />
  );
}

createRoot(document.getElementById("root")!).render(
    <ThemeProvider theme={hertzTheme}>
      <StrictMode>
        <AppRouter />
      </StrictMode>
    </ThemeProvider>
);
