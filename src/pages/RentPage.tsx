import RentVehicleForm from "@/forms/rent/RentVehicleForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Car } from "lucide-react";

export default function RentPage() {
  return (
    <div className="w-full flex items-center justify-center px-4 py-6">
      <Card className="w-full max-w-lg shadow-lg rounded-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Car className="h-6 w-6 text-primary" />
          </div>

          <CardTitle className="text-2xl font-semibold">
            Rent a Vehicle
          </CardTitle>

          <CardDescription>
            Fill in the details below to rent a vehicle
          </CardDescription>
        </CardHeader>

        <CardContent>
          <RentVehicleForm />
        </CardContent>
      </Card>
    </div>
  );
}