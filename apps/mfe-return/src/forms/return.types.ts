import type { z } from 'zod';

import type { returnVehicleSchema } from './return.schema';

export type ReturnVehicleFormValues = z.infer<typeof returnVehicleSchema>;
