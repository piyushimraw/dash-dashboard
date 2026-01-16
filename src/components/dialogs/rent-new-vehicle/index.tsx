import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import { type DialogRegistry } from "../useGlobalDialogStore";
import RentVehicleForm from "@/forms/rent/RentVehicleForm";
import { Car } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RentNewVehicleDialog(
  {
    //   onClose,
  }: DialogRegistry["RENT_VEHICLE"] & { onClose: () => void }
) {
  return (
    <DialogContent
      className={cn(
        "w-full md:max-w-230 max-w-95vw rounded-md outline-none border-0 p-8",
        "[&>button[data-slot='dialog-close']>svg]:w-6",
        "[&>button[data-slot='dialog-close']>svg]:h-6",
        "[&>button[data-slot='dialog-close']]:mr-4",
        "[&>button[data-slot='dialog-close']]:mt-2"
      )}
    >
      <div className="flex">
        {/* LEFT SECTION */}
        <div className="w-[38%] bg-muted/40 px-8 py-10">
          <DialogHeader className="text-left space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Car className="h-7 w-7 text-primary" />
            </div>

            <h2 className="text-2xl font-semibold tracking-tight">
              Rent a Vehicle
            </h2>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Fill in the details below to rent a vehicle quickly and easily.
              Please ensure all information is correct before submitting.
            </p>
          </DialogHeader>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex-1 px-8 py-10">
          <RentVehicleForm />
        </div>
      </div>
    </DialogContent>
  );
}
