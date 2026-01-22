import type { RouterContext } from "@/routerContext";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { PWAInstallBanner } from "@/components/PWAInstallBanner";
import { MfeLoadingBar } from "@/components/MfeLoadingBar";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <MfeLoadingBar />
      <Outlet />
      <PWAInstallBanner />
    </>
  );
}
