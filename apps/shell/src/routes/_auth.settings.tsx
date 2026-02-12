import { SettingsPage } from '@apps/mfe-settings';
import { createFileRoute } from '@tanstack/react-router';

import { requireRole } from '@/auth/requireRole';
import { RouteErrorBoundary } from '@/components/error-boundary/RouteErrorBoundary';
import { MfeErrorBoundary } from '@/components/error-boundary/MfeErrorBoundary';
import { ROLES } from '@/config/roles';

export const Route = createFileRoute('/_auth/settings')({
  beforeLoad: () => requireRole([ROLES.SUPER_ADMIN, ROLES.SYSTEM_ADMIN]),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RouteErrorBoundary routeName="Settings">
      <MfeErrorBoundary mfeName="Settings">
        <SettingsPage />
      </MfeErrorBoundary>
    </RouteErrorBoundary>
  );
}
