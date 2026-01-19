import type { z } from "zod";
import { rentVehicleSchema } from "./rent.schema";

export type RentVehicleFormValues = z.infer<typeof rentVehicleSchema>;
