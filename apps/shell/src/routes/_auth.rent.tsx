import { RentPage } from '@apps/mfe-rent';
import { createFileRoute } from '@tanstack/react-router';

import { requireRole } from '@/auth/requireRole';
// import { ErrorTester } from '@/components/error-boundary/ErrorTester'
import { MfeErrorBoundary } from '@/components/error-boundary/MfeErrorBoundary';
import { RouteErrorBoundary } from '@/components/error-boundary/RouteErrorBoundary';
import { ROLES } from '@/config/roles';
// import { BrokenComponent } from './brokencomponent'

export const Route = createFileRoute('/_auth/rent')({
  beforeLoad: () => requireRole([ROLES.SUPER_ADMIN, ROLES.COUNTER_AGENT]),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RouteErrorBoundary routeName="Rent Page">
      {/* <MfeErrorBoundary mfeName="Broken Component" fallback={<div>Something went wrong in Broken Component MFE!</div>}  >
        <BrokenComponent />
      </MfeErrorBoundary> */}

      {/* <ErrorTester level="route" /> */}

      <MfeErrorBoundary mfeName="Rent Page">
        <RentPage />
      </MfeErrorBoundary>
    </RouteErrorBoundary>
  );
}
