import { RentVehicleForm } from './forms/RentVehicleForm';
import { Car } from 'lucide-react';

export function RentPage() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left panel */}
      <div className="w-full md:w-[38%] bg-muted/40 px-4 pt-16 pb-6 md:px-8 md:pt-10 md:pb-10">
        <div className="space-y-4 text-center md:text-left">
          <div className="mx-auto md:mx-0 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Car className="h-7 w-7 text-primary" />
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">Rent a Vehicle</h2>

          <p className="text-sm leading-relaxed text-muted-foreground">
            Fill in the details to rent a vehicle quickly and easily.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full md:flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-10">
        <RentVehicleForm />
      </div>
    </div>
  );
}
