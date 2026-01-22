import { MfeErrorBoundary } from "@/components/MfeErrorBoundary";
import { DashboardPage } from "@apps/mfe-dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <MfeErrorBoundary mfeName="Dashboard">
      <DashboardPage />
    </MfeErrorBoundary>
  );
}
