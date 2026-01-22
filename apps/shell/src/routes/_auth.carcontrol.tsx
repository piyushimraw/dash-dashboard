import { requireRole } from '@/auth/requireRole'
import { ROLES } from '@/config/roles'
import CarControl from '@/pages/CarControl'
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
  return <CarControl/>
}
