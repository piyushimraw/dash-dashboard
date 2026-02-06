import { RouteErrorBoundary } from '@/components/error-boundary/RouteErrorBoundary';
import { MfeErrorBoundary } from '@/components/error-boundary/MfeErrorBoundary';
import { DashboardPage } from '@apps/mfe-dashboard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RouteErrorBoundary routeName="Dashboard">
      <MfeErrorBoundary mfeName="Dashboard">
        <DashboardPage />
      </MfeErrorBoundary>
    </RouteErrorBoundary>
  );
}
