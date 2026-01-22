import { requireRole } from '@/auth/requireRole'
import { ROLES } from '@/config/roles'
import ReportsPage from '@/pages/ReportsPage'
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
  return <ReportsPage/>
}
