import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Car, Calendar, User, MapPin } from "lucide-react";

import FormProvider from "@/components/form/FormProvider";
import FormInput from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";

import { rentVehicleSchema } from "./rent.schema";
import type { RentVehicleFormValues } from "./rent.types";

export default function RentVehicleForm() {
  const methods = useForm<RentVehicleFormValues>({
    resolver: zodResolver(rentVehicleSchema),
    mode: "onChange",
    defaultValues: {
      vehicleId: "",
      customerId: "",
      rentDate: "",
      expectedReturnDate: "",
      pickupLocation: "",
    },
  });

  const onSubmit = (data: RentVehicleFormValues) => {
    console.log("Rent Vehicle Data:", data);
    // API call here
  };

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <div className="space-y-5 max-w-md mx-auto">
        <FormInput
          name="vehicleId"
          label="Vehicle ID"
          icon={<Car size={16} className="text-muted-foreground" />}
        />

        <FormInput
          name="customerId"
          label="Customer ID"
          icon={<User size={16} className="text-muted-foreground" />}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="rentDate"
            label="Rent Date"
            type="date"
            icon={<Calendar size={16} className="text-muted-foreground" />}
          />

          <FormInput
            name="expectedReturnDate"
            label="Expected Return Date"
            type="date"
            icon={<Calendar size={16} className="text-muted-foreground" />}
          />
        </div>
        <FormInput
          name="pickupLocation"
          label="Pickup Location"
          icon={<MapPin size={16} className="text-muted-foreground" />}
        />

        <Button type="submit" className="w-full">
          Rent Vehicle
        </Button>
      </div>
    </FormProvider>
  );
}
