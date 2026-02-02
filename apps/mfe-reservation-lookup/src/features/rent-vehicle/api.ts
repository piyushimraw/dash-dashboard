import { handleQueryError, http } from "@packages/api-client";

export type RentedVehicleResponseType = {
  id: number;
  customerName: string;
  serviceLevel: "Gold" | "Silver" | "Platinum";
  cvi: string;
  arrivalLocation: string;
  estArrival: string;
  flightInfoStatus: "On Time" | "Delayed" | "Cancelled";
  numberOfDays: number;
  resClass: "SUV" | "Sedan" | "Hatchback";
  resStatus: "Confirmed" | "Completed" | "Cancelled";
  dashStatus: "Active" | "Closed" | "Inactive";
  rentDate: string;
  returnDate: string;
  email: string;
  phone: string;
};

// old api
// ("https://dummyjson.com/c/fd99-532e-4733-83a3");

//for using BFF api
//http://localhost:3001/api/vehicles


export const getRentedVehicleList = () =>
  http<RentedVehicleResponseType[]>(
    "https://dummyjson.com/c/1394-326c-4220-88d7",
);

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
