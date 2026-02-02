import { RouteErrorBoundary } from "@/components/error-boundary/RouteErrorBoundary";
import { MfeErrorBoundary } from "@/components/error-boundary/MfeErrorBoundary";
import { createFileRoute } from "@tanstack/react-router";
import { ReservationLookupPageWithBff } from "@apps/mfe-reservation-lookup";

export const Route = createFileRoute('/_auth/bff_demo')({
  component: RouteComponent,
})

function RouteComponent() {
   return (
      <RouteErrorBoundary routeName="BFF Demo">
        <MfeErrorBoundary mfeName="BFF Demo">
          <ReservationLookupPageWithBff />
        </MfeErrorBoundary>
      </RouteErrorBoundary>
    );
}
