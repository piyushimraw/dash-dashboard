import { getRentedVehicles } from "@packages/api-client";
import type { RentedVehicle } from "@packages/mfe-types";

export type RentedVehicleResponseType = RentedVehicle;

// Use the BFF proxy endpoint instead of calling the external upstream service
export const getRentedVehicleList = (query?: Record<string, string | number>) =>
  getRentedVehicles(query);

// export const getRentedVehicleById = (id: string) =>
//   http<User>(`/api/test/${id}`);
