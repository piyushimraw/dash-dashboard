import { Sidebar } from "@/components/Sidebar";
import { Button, Card, CardContent } from "@dash/shared-ui";
import { useAuthStore } from "@dash/shared-state";
import {
  createFileRoute,
  Outlet,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useMemo, useState } from "react";

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
  const location = useLocation();

  const { logout, userId } = useAuthStore();
  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pageName = useMemo(() => {
    const pathname = location.pathname;
    const page_title = pathname.replace("/", "").toUpperCase();
    return page_title;
  }, [location.pathname]);

  return (
    <>
      <div className="h-dvh w-full bg-background flex">
        <Sidebar
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-14 sm:h-16 border-b bg-white/80 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden min-h-[44px] min-w-[44px]"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={sidebarOpen}
                aria-controls="main-sidebar"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">
                  {pageName}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Welcome back{" "}
                  <span className="text-yellow-500 font-medium px-1">
                    {userId}
                  </span>
                  ! Here's your overview.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-3 pl-4 border-l">
                <div className="text-right">
                  <p className="text-sm font-medium">GEHDOFF / 01</p>
                  <p className="text-xs text-muted-foreground">CASFO15</p>
                </div>
              </div>
            </div>
          </header>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto flex flex-col">
            <main className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6">
              <Outlet />
            </main>

            <footer className="flex-shrink-0">
              <Card className="w-full bg-tan/30 border-tan-dark/30 rounded-xs">
                <CardContent className="p-4 text-center">
                  <p className="text-xs sm:text-sm font-medium text-foreground">
                    Copyright (c) 2003 The Hertz Corporation - All Rights
                    Reserved
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-2xl mx-auto">
                    The information contained herein is confidential and
                    proprietary. Unauthorized use, duplication or disclosure is
                    prohibited by law.
                  </p>
                </CardContent>
              </Card>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
