import RentVehicleForm from "@/forms/rent/RentVehicleForm";
import { Car } from "lucide-react";

export default function RentPage() {
  return (
    <div className="w-full h-full flex items-center justify-center px-4 py-6">
      <div className="w-full h-full md:w-[38%] bg-muted/40 px-4 pt-16 pb-6 md:px-8 md:pt-10 md:pb-10">
        <div className="space-y-4 text-center md:text-left">
          <div className="mx-auto md:mx-0 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Car className="h-7 w-7 text-primary" />
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">
            Rent a Vehicle
          </h2>

          <p className="text-sm leading-relaxed text-muted-foreground">
            Fill in the details to rent a vehicle quickly and easily.
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-10">
        <RentVehicleForm />
      </div>
    </div>
  );
}
