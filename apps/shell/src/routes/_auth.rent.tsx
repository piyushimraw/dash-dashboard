import { RentPage } from "@dash/mfe-rentals";
import { createFileRoute } from "@tanstack/react-router";
import { useGlobalDialogStore } from "@/components/dialogs/useGlobalDialogStore";

export const Route = createFileRoute("/_auth/rent")({
  component: RouteComponent,
});

function RouteComponent() {
  const { openDialog } = useGlobalDialogStore();

  return <RentPage onOpenRentDialog={() => openDialog("RENT_VEHICLE")} />;
}
