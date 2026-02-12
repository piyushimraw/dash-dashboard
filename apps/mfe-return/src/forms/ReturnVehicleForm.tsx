import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Car, Calendar, MapPin, FileText } from 'lucide-react';
import { FormProvider, FormInput, Button } from '@packages/ui';

import { returnVehicleSchema } from './return.schema';
import type { ReturnVehicleFormValues } from './return.types';

export function ReturnVehicleForm() {
  const methods = useForm<ReturnVehicleFormValues>({
    resolver: zodResolver(returnVehicleSchema),
    mode: 'onChange',
    defaultValues: {
      vehicleId: '',
      returnDate: '',
      returnLocation: '',
      damageNotes: '',
    },
  });

  const onSubmit = (_data: ReturnVehicleFormValues) => {
    // console.log('Return Vehicle Data:', data);
    // API call here
  };

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <div className="space-y-5 max-w-md mx-auto">
        <FormInput
          name="vehicleId"
          label="Vehicle ID"
          icon={<Car className="h-4 w-4 text-muted-foreground" />}
        />

        <FormInput
          name="returnDate"
          label="Return Date"
          type="date"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />

        <FormInput
          name="returnLocation"
          label="Return Location"
          icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
        />

        <FormInput
          name="damageNotes"
          label="Damage Notes (Optional)"
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        />

        <Button type="submit" className="w-full">
          Return Vehicle
        </Button>
      </div>
    </FormProvider>
  );
}
