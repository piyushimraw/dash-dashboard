import { MfeErrorBoundary } from '@/components/MfeErrorBoundary'
import { VehicleExchangePage } from '@apps/mfe-vehicle-exchange'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/vehicle_exchange')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <MfeErrorBoundary mfeName="Vehicle Exchange">
      <VehicleExchangePage />
    </MfeErrorBoundary>
  )
}
