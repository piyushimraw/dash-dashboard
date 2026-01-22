import { requireRole } from '@/auth/requireRole'
import { ROLES } from '@/config/roles'
import SettingPage from '@/pages/SettingPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/settings')({
  beforeLoad: () =>
    requireRole([
      ROLES.SUPER_ADMIN,
      ROLES.SYSTEM_ADMIN
    ]),
  component: RouteComponent,
})

function RouteComponent() {
  return <SettingPage/>
}
