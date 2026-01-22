import { MfeErrorBoundary } from '@/components/MfeErrorBoundary'
import ReturnPage from '@/pages/ReturnPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/return')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <MfeErrorBoundary mfeName="Return">
      <ReturnPage />
    </MfeErrorBoundary>
  )
}
