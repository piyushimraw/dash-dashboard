import { getRentedVehicles, http } from "@packages/api-client";
import type { RentedVehicle } from "@packages/mfe-types";

export type RentedVehicleResponseType = RentedVehicle;

// Use the BFF proxy endpoint instead of calling the external upstream service
export const getRentedVehicleList = (query?: Record<string, string | number>) =>
  getRentedVehicles(query);

export const getRentedVehicleListWithCorruptData = () =>
  http<RentedVehicleResponseType[]>(
    "https://dummyjson.com/c/6436-1d85-4abd-bdad",
);

// uncomment to test global test error using handleQueryError
// export const getRentedVehicleList = async () => {
//   try {
//     throw {
//       response: {
//         status: 500,
//         data: {
//           message: "Internal Server Error",
//         },
//       },
//     };

//     // Normal call (won't be reached while testing)
//     return await http<RentedVehicleResponseType[]>(
//       "https://dummyjson.com/c/1394-326c-4220-88d7"
//     );
//   } catch (error) {
//     // Always rethrow so React Query can handle it
//     handleQueryError(error);
//     throw error;
//   }
// };


// export const getRentedVehicleById = (id: string) =>
//   http<User>(`/api/test/${id}`);
