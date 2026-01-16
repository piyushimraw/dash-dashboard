import { ReservationLookupPage } from "@/pages/ReservationLookupPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/reservation-lookup")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ReservationLookupPage />;
}
