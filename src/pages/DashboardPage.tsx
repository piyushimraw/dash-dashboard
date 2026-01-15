import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Car,
  ClipboardList,
  ArrowRightLeft,
  TrendingUp,
  // Clock,
  // AlertCircle,
  ChevronRight,
} from "lucide-react";
// import { useNavigate } from "@tanstack/react-router";

const quickActions = [
  {
    label: "New Rental",
    icon: <Car className="h-5 w-5" aria-hidden="true" />,
    path: "/rent",
  },
  {
    label: "Process Return",
    icon: <ClipboardList className="h-5 w-5" aria-hidden="true" />,
    path: "/return",
  },
  {
    label: "Vehicle Exchange",
    icon: <ArrowRightLeft className="h-5 w-5" aria-hidden="true" />,
    path: "/vehicle_exchange",
  },
  {
    label: "AAO",
    icon: <TrendingUp className="h-5 w-5" aria-hidden="true" />,
    path: "/aao",
  },
];

export function DashboardPage() {
  // const navigate = useNavigate();
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Welcome Banner */}
      {/* <Card
        className="bg-gradient-to-r from-sidebar to-lavender-deep border-0 text-white overflow-hidden relative"
        role="region"
        aria-label="Welcome banner"
      >
        <div
          className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-sidebar-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"
          aria-hidden="true"
        />
        <CardContent className="p-4 sm:p-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Welcome to TAS</h2>
              <p className="text-white/80 mt-1 text-sm sm:text-base">
                Logon Successful
              </p>
              <div
                className="flex items-center gap-2 mt-3 sm:mt-4 text-xs sm:text-sm"
                role="alert"
              >
                <AlertCircle
                  className="h-4 w-4 text-sidebar-primary flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-white/70">
                  Your password will expire in 20 days
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-white/60">Session started</p>
              <p className="text-sm font-medium flex items-center gap-1 sm:justify-end">
                <Clock className="h-4 w-4" aria-hidden="true" />
                <time dateTime={new Date().toISOString()}>
                  {new Date().toLocaleTimeString()}
                </time>
              </p>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Quick Actions */}
      <Card className="w-full sm:max-w-md">
        <CardHeader className="pb-3 px-4 sm:px-6">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-4 sm:px-6">
          {quickActions.map((action, i) => (
            <Button
              key={i}
              variant="outline"
              className="w-full justify-between min-h-[48px] hover:bg-accent touch-manipulation"
              aria-label={action.label}
              // onClick={() => navigate({ to: action.path })}
            >
              <span className="flex items-center gap-3">
                <span
                  className="h-8 w-8 rounded-lg bg-sidebar-primary/10 flex items-center justify-center text-sidebar-primary"
                  aria-hidden="true"
                >
                  {action.icon}
                </span>
                <span className="text-sm">{action.label}</span>
              </span>
              <ChevronRight
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Legal Notice */}
      {/* <Card className="bg-tan/30 border-tan-dark/30">
        <CardContent className="p-4 text-center">
          <p className="text-xs sm:text-sm font-medium text-foreground">
            Copyright (c) 2003 The Hertz Corporation - All Rights Reserved
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl mx-auto">
            The information contained herein is confidential and proprietary.
            Unauthorized use, duplication or disclosure is prohibited by law.
          </p>
        </CardContent>
      </Card> */}
    </main>
  );
}
