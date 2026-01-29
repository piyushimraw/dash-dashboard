import { requireRole } from '@/auth/requireRole'
import { RouteErrorBoundary } from '@/components/error-boundary/RouteErrorBoundary'
import { MfeErrorBoundary } from '@/components/error-boundary/MfeErrorBoundary'
import { ROLES } from '@/config/roles'
import { ReportsPage } from '@apps/mfe-reports'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/reports')({
  beforeLoad: () =>
    requireRole([
      ROLES.SUPER_ADMIN,
      ROLES.FLEET_MANAGER
    ]),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <RouteErrorBoundary routeName="Reports">
      <MfeErrorBoundary mfeName="Reports">
        <ReportsPage />
      </MfeErrorBoundary>
    </RouteErrorBoundary>
  )
}
