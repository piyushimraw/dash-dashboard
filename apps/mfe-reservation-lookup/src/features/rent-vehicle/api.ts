import { http } from "@packages/api-client";

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
export const getRentedVehicleList = () =>
  http<RentedVehicleResponseType[]>(
    "https://dummyjson.com/c/1394-326c-4220-88d7",
  );

// export const getRentedVehicleById = (id: string) =>
//   http<User>(`/api/test/${id}`);
