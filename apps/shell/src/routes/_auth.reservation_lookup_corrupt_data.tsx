import { requireRole } from "@/auth/requireRole";
import { RouteErrorBoundary } from "@/components/error-boundary/RouteErrorBoundary";
import { MfeErrorBoundary } from "@/components/error-boundary/MfeErrorBoundary";
import { ROLES } from "@/config/roles";
import { ReservationLookupPage } from "@apps/mfe-reservation-lookup";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/reservation_lookup_corrupt_data")({
  beforeLoad: () =>
    requireRole([
      ROLES.SUPER_ADMIN,
      ROLES.COUNTER_AGENT,
      ROLES.FLEET_MANAGER,
    ]),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RouteErrorBoundary routeName="Reservation Lookup With Corrupt Data">
      <MfeErrorBoundary mfeName="Reservation Lookup With Corrupt Data">
        <ReservationLookupPage showCorruptData={true} />
      </MfeErrorBoundary>
    </RouteErrorBoundary>
  );
}
