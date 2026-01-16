import { z } from "zod";

export const returnVehicleSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle ID is required"),
  returnDate: z.string().min(1, "Return date is required"),
  returnLocation: z.string().min(1, "Return location is required"),
  damageNotes: z.string().optional(),
});
