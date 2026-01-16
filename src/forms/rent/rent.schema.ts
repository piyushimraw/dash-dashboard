import { z } from "zod";

export const rentVehicleSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle ID is required"),
  customerId: z.string().min(1, "Customer ID is required"),
  rentDate: z.string().min(1, "Rent date is required"),
  expectedReturnDate: z.string().min(1, "Expected return date is required"),
  pickupLocation: z.string().min(1, "Pickup location is required"),
});
