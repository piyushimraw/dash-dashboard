import { CarControlPage } from '@apps/mfe-car-control';
import { createFileRoute } from '@tanstack/react-router';

import { requireRole } from '@/auth/requireRole';
import { RouteErrorBoundary } from '@/components/error-boundary/RouteErrorBoundary';
import { MfeErrorBoundary } from '@/components/error-boundary/MfeErrorBoundary';
import { ROLES } from '@/config/roles';

export const Route = createFileRoute('/_auth/carcontrol')({
  beforeLoad: () => requireRole([ROLES.SUPER_ADMIN, ROLES.FLEET_MANAGER]),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RouteErrorBoundary routeName="Car Control">
      <MfeErrorBoundary mfeName="Car Control">
        <CarControlPage />
      </MfeErrorBoundary>
    </RouteErrorBoundary>
  );
}
