import { useGlobalDialogStore } from "../dialogs/useGlobalDialogStore";
import { Button } from "../ui/button";

export default function HeaderComponent() {
  const { openDialog } = useGlobalDialogStore();
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Rent Vehicles</h2>
        <p className="text-sm text-muted-foreground">
          Manage and track all rented vehicles
        </p>
      </div>

      <Button
        onClick={() => openDialog("RENT_VEHICLE")}
        className="flex items-center gap-2"
      >
        + Add New Vehicle
      </Button>
    </div>
  );
}
