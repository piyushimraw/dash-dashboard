import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import { type DialogRegistry } from "../useGlobalDialogStore";
import RentVehicleForm from "@/forms/rent/RentVehicleForm";
import { Car } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RentNewVehicleDialog({
  onClose,
}: DialogRegistry["RENT_VEHICLE"] & { onClose: () => void }) {
  return (
    <DialogContent
      className={cn(
        "w-full md:max-w-230 max-w-95vw rounded-md outline-none border-0 p-8",
        "md:[&>button[data-slot='dialog-close']>svg]:block",
        //hiding default button for mobile screen
        "[&>button[data-slot='dialog-close']>svg]:hidden",
        "[&>button[data-slot='dialog-close']>svg]:h-6",
        "[&>button[data-slot='dialog-close']]:mr-4",
        "[&>button[data-slot='dialog-close']]:mt-2"
      )}
    >
      <div className="relative flex max-h-[100dvh] flex-col md:flex-row overflow-hidden">
        {/* custom close button for mobile screen */}
        <button
          onClick={() => onClose()}
          className="md:hidden absolute right-4 top-4 z-50 rounded-md p-2
               bg-background/80 backdrop-blur
               hover:bg-muted focus:outline-none
               safe-top"
        >
          ✕
        </button>

        {/* LEFT SECTION */}
        <div className="w-full md:w-[38%] bg-muted/40 px-4 pt-16 pb-6 md:px-8 md:pt-10 md:pb-10">
          <DialogHeader className="space-y-4 text-center md:text-left">
            <div className="mx-auto md:mx-0 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Car className="h-7 w-7 text-primary" />
            </div>

            <h2 className="text-2xl font-semibold tracking-tight">
              Rent a Vehicle
            </h2>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Fill in the details to rent a vehicle quickly and easily.
            </p>
          </DialogHeader>
        </div>

        {/* RIGHT SECTION (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-10">
          <RentVehicleForm />
        </div>
      </div>
    </DialogContent>
  );
}
