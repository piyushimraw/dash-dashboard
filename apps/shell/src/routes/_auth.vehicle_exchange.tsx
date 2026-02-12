import { VehicleExchangePage } from '@apps/mfe-vehicle-exchange';
import { createFileRoute } from '@tanstack/react-router';

import { RouteErrorBoundary } from '@/components/error-boundary/RouteErrorBoundary';
import { MfeErrorBoundary } from '@/components/error-boundary/MfeErrorBoundary';

export const Route = createFileRoute('/_auth/vehicle_exchange')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RouteErrorBoundary routeName="Vehicle Exchange">
      <MfeErrorBoundary mfeName="Vehicle Exchange">
        <VehicleExchangePage />
      </MfeErrorBoundary>
    </RouteErrorBoundary>
  );
}
