import type { z } from 'zod';

import type { rentVehicleSchema } from './rent.schema';

export type RentVehicleFormValues = z.infer<typeof rentVehicleSchema>;
