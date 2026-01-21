import { requireRole } from "@/auth/requireRole";
import { ROLES } from "@/config/roles";
import ReservationLookupPage from "@/pages/ReservationLookupPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/reservation_lookup")({
  beforeLoad: () => requireRole([ROLES.SUPER_ADMIN, ROLES.COUNTER_AGENT]),
  component: RouteComponent,
});

function RouteComponent() {
  return <ReservationLookupPage />;
}
