import { CarAvailabilityAssignmentPage } from "@/pages/CarAvailabilityAssignmentPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/car-availability-assignment")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CarAvailabilityAssignmentPage />;
}
