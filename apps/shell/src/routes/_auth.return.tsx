import { ReturnPage } from '@apps/mfe-return';
import { createFileRoute } from '@tanstack/react-router';

import { requireRole } from '@/auth/requireRole';
import { RouteErrorBoundary } from '@/components/error-boundary/RouteErrorBoundary';
import { MfeErrorBoundary } from '@/components/error-boundary/MfeErrorBoundary';
import { ROLES } from '@/config/roles';

export const Route = createFileRoute('/_auth/return')({
  beforeLoad: () => requireRole([ROLES.SUPER_ADMIN, ROLES.COUNTER_AGENT]),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RouteErrorBoundary routeName="Return">
      <MfeErrorBoundary mfeName="Return">
        <ReturnPage />
      </MfeErrorBoundary>
    </RouteErrorBoundary>
  );
}
