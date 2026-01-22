import { MfeErrorBoundary } from '@/components/MfeErrorBoundary'
import AaoPage from '@/pages/AaoPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/aao')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <MfeErrorBoundary mfeName="AAO">
      <AaoPage />
    </MfeErrorBoundary>
  )
}
