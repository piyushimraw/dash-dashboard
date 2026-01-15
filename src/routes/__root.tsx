import { Outlet } from "react-router-dom";
import { PWAInstallBanner } from "@/components/PWAInstallBanner";

export function RootLayout() {
  return (
    <>
      <Outlet />
      <PWAInstallBanner />
    </>
  );
}
