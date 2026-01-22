import { Header, Footer, Sidebar } from "@/components/layout";
import useAuthStore from "@/store/useAuthStore";
import {
  createFileRoute,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isLoggedIn) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  const navigate = useNavigate();

  const { logout } = useAuthStore();
  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-dvh w-full bg-background flex">
      <Sidebar
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          sidebarOpen={sidebarOpen}
        />

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <main className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6">
            <Outlet />
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}
