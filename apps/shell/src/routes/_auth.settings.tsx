import { requireRole } from '@/auth/requireRole'
import { MfeErrorBoundary } from '@/components/MfeErrorBoundary'
import { ROLES } from '@/config/roles'
import { SettingsPage } from '@apps/mfe-settings'
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
  return (
    <MfeErrorBoundary mfeName="Settings">
      <SettingsPage />
    </MfeErrorBoundary>
  )
}
