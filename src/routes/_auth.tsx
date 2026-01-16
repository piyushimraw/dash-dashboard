import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/useAuthStore";
import {
  createFileRoute,
  Outlet,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";
import {
  // Bell,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent  } from "@/components/ui/card";


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

  const pageMeta: Record<string, { title: string; subtitle?: string }> = {
    "/reservation-lookup": {
      title: "Reservation Lookup",
      subtitle: "Search and review reservations quickly.",
    },
    "/scan-payment-integration": {
      title: "Scan & Payment Integration",
      subtitle: "Manage scans and Stripe payment status.",
    },
    "/drivers-license-validation": {
      title: "Driver's License Scan & Validation",
      subtitle: "Verify license details before checkout.",
    },
    "/car-availability-assignment": {
      title: "Car Availability and Assignment",
      subtitle: "Assign the right vehicle for each reservation.",
    },
    "/rental-agreement-generation": {
      title: "Rental Agreement Generation",
      subtitle: "Generate agreements after payment and validation.",
    },
    "/gate-verification": {
      title: "Gate Verification",
      subtitle: "Confirm clearance for customer exits.",
    },
    "/returns": {
      title: "Returns",
      subtitle: "Process limited return workflows.",
    },
  };

  const { logout } = useAuthStore();
  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen  bg-background flex">
        <Sidebar
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Header */}
          <header className="h-14 sm:h-16 border-b bg-white/80 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
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
              {pageMeta[location.pathname] && (
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-foreground">
                    {pageMeta[location.pathname].title}
                  </h1>
                  {pageMeta[location.pathname].subtitle && (
                    <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                      {pageMeta[location.pathname].subtitle}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {/* <Button
                variant="ghost"
                size="icon"
                className="relative min-h-[44px] min-w-[44px]"
                aria-label="Notifications, 1 unread"
              >
                {/* <Bell className="h-5 w-5" aria-hidden="true" />
                <span
                  className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"
                  aria-hidden="true"
                />
              </Button> */}
              <div className="hidden sm:flex items-center gap-3 pl-4 border-l">
                <div className="text-right">
                  <p className="text-sm font-medium">GEHDOFF / 01</p>
                  <p className="text-xs text-muted-foreground">CASFO15</p>
                </div>
              </div>
            </div>
          </header>

          <Outlet />
          
          <Card className="static bottom-0 w-full bg-tan/30 border-tan-dark/30">
            <CardContent className="p-4 text-center">
              <p className="text-xs sm:text-sm font-medium text-foreground">
                Copyright (c) 2003 The Hertz Corporation - All Rights Reserved
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-2xl mx-auto">
                The information contained herein is confidential and proprietary.
                Unauthorized use, duplication or disclosure is prohibited by law.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
