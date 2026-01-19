import type { z } from "zod";
import { returnVehicleSchema } from "./return.schema";

export type ReturnVehicleFormValues = z.infer<typeof returnVehicleSchema>;
