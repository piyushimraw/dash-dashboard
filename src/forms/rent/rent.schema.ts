import { z } from "zod";

export const rentVehicleSchema = z.object({
  custName: z
    .string()
    .min(2, "Customer name must be at least 2 characters")
    .max(50, "Customer name must be less than 50 characters"),
  custEmail: z.string().email("Invalid email address"),
  custPhone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
  vehicleType: z.string().min(1, "Vehicle type is required"),
  rentDate: z.string().min(1, "Rent date is required"),
  expectedReturnDate: z.string().min(1, "Expected return date is required"),
  pickupLocation: z.string().min(1, "Pickup location is required"),
});
