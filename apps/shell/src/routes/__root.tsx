import type { RouterContext } from "@/routerContext";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { PWAInstallBanner } from "@/components/PWAInstallBanner";
import { MfeLoadingBar } from "@/components/MfeLoadingBar";
import { MfeErrorBoundary } from "@/components/error-boundary/MfeErrorBoundary";
import { RouteErrorBoundary } from "@/components/error-boundary/RouteErrorBoundary";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
     <RouteErrorBoundary routeName="Root">

          <MfeErrorBoundary mfeName="Loading Bar">
            <MfeLoadingBar />
          </MfeErrorBoundary>

          <MfeErrorBoundary mfeName="Outlet">
            <Outlet />
          </MfeErrorBoundary>

         <MfeErrorBoundary mfeName="PWAInstallBanner">
            <PWAInstallBanner />
          </MfeErrorBoundary>

      </RouteErrorBoundary>
  );
}
