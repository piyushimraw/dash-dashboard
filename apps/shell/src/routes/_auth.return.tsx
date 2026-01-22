import { requireRole } from '@/auth/requireRole'
import { MfeErrorBoundary } from '@/components/MfeErrorBoundary'
import { ROLES } from '@/config/roles'
import { ReturnPage } from '@apps/mfe-return'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/return')({
  beforeLoad: () =>
    requireRole([
      ROLES.SUPER_ADMIN,
      ROLES.COUNTER_AGENT
    ]),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <MfeErrorBoundary mfeName="Return">
      <ReturnPage />
    </MfeErrorBoundary>
  )
}
