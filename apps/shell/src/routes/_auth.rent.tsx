import { requireRole } from '@/auth/requireRole'
import { MfeErrorBoundary } from '@/components/MfeErrorBoundary'
import { ROLES } from '@/config/roles'
import RentPage from '@/pages/RentPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/rent')({
  beforeLoad: () =>
    requireRole([
      ROLES.SUPER_ADMIN,
      ROLES.COUNTER_AGENT
    ]),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <MfeErrorBoundary mfeName="Rent">
      <RentPage />
    </MfeErrorBoundary>
  )
}
