import { z } from "zod";

export const loginSchema = z.object({
  userId: z
    .string()
    .min(1, "User ID is required")
    .trim(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must not exceed 50 characters"),

  userLocation: z
    .string()
    .min(1, "User location is required"),

  loginLocation: z
    .string()
    .min(1, "Login location is required"),
});
