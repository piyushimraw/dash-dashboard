import { z } from "zod";

export const LOCATION_OPTIONS = [
  { label: "San Francisco, CA (Office 15)", value: "CASFO15" },
  { label: "Los Angeles, CA (Office 02)", value: "CALAX02" },
  { label: "New York City, NY (Office 01)", value: "NYNYC01" },
  { label: "Austin, TX (Office 07)", value: "TXAUS07" },
  { label: "Dallas, TX (Office 03)", value: "TXDAL03" },
  { label: "Seattle, WA (Office 04)", value: "WASEA04" },
  { label: "Chicago, IL (Office 09)", value: "ILCHI09" },
  { label: "Miami, FL (Office 06)", value: "FLMIA06" },
];


export const LOCATION_VALUES = LOCATION_OPTIONS.map(
  (l) => l.value
) as [string, ...string[]];


export const locationSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});


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
    .min(1, "Login location is required")
    .refine((val) => LOCATION_VALUES.includes(val), {
      message: "Invalid login location",
    }),
});
