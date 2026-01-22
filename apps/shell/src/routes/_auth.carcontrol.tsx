import { requireRole } from '@/auth/requireRole'
import { MfeErrorBoundary } from '@/components/MfeErrorBoundary'
import { ROLES } from '@/config/roles'
import { CarControlPage } from '@apps/mfe-car-control'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/carcontrol')({
  beforeLoad: () =>
    requireRole([
      ROLES.SUPER_ADMIN,
      ROLES.FLEET_MANAGER
    ]),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <MfeErrorBoundary mfeName="Car Control">
      <CarControlPage />
    </MfeErrorBoundary>
  )
}
