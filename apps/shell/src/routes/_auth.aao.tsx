import { AaoPage } from '@apps/mfe-aao';
import { createFileRoute } from '@tanstack/react-router';

import { RouteErrorBoundary } from '@/components/error-boundary/RouteErrorBoundary';
import { MfeErrorBoundary } from '@/components/error-boundary/MfeErrorBoundary';

export const Route = createFileRoute('/_auth/aao')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RouteErrorBoundary routeName="AAO">
      {/* <MfeErrorBoundary fallback={<>MFE Error Boundary Fallback for AAO</> } mfeName="AAO">
        <ErrorTester level="component" />
      </MfeErrorBoundary> */}

      <MfeErrorBoundary mfeName="AAO">
        <AaoPage />
      </MfeErrorBoundary>
    </RouteErrorBoundary>
  );
}
