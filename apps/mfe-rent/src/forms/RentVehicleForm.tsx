import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Car, Calendar, User, MapPin } from 'lucide-react';
import { FormProvider, FormInput, FormSelect, Button } from '@packages/ui';
import { eventBus, MfeEventNames } from '@packages/event-bus';

import { rentVehicleSchema } from './rent.schema';
import type { RentVehicleFormValues } from './rent.types';

export function RentVehicleForm() {
  // console.log('RentVehicleForm');
  const form = useForm<RentVehicleFormValues>({
    resolver: zodResolver(rentVehicleSchema),
    mode: 'onChange',
    defaultValues: {
      custName: '',
      custEmail: '',
      custPhone: '',
      vehicleType: 'SUV',
      rentDate: '',
      expectedReturnDate: '',
      pickupLocation: '',
    },
  });

  const onSubmit = (_data: RentVehicleFormValues) => {
    // console.log('Rent form submitted:', data);
    // TODO: API call here

    eventBus.emit(MfeEventNames.DataRefresh, { entity: 'rental' });
  };

  return (
    <FormProvider methods={form} onSubmit={form.handleSubmit(onSubmit)}>
      <div className="w-full space-y-5 max-w-md mx-auto">
        <FormInput
          name="custName"
          label="Customer Name"
          placeholder="Enter full name"
          icon={<Car size={16} className="text-muted-foreground" />}
        />

        <FormInput
          name="custEmail"
          label="Customer Email"
          placeholder="Enter email"
          icon={<User size={16} className="text-muted-foreground" />}
        />
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4 ">
          <FormInput
            name="custPhone"
            label="Customer Phone"
            placeholder="Ex: +1 6234...."
            icon={<User size={16} className="text-muted-foreground" />}
          />
          <FormSelect
            name="vehicleType"
            label="Vehicle Type"
            options={[
              { label: 'SUV', value: 'SUV' },
              { label: 'Sedan\t', value: 'Sedan' },
              { label: 'Hatchback\t', value: 'Hatchback' },
            ]}
          />
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4 ">
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
