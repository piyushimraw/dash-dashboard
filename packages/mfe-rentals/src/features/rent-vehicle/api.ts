import { http } from "@dash/shared-utils";

export type RentedVehicleResponseType = {
  vehicleId: string;
  customerId: string;
  rentDate: string;
  expectedReturnDate: string;
  pickupLocation: string;
  status: "Approved" | "Pending" | "Rejected";
};

export const getRentedVehicleList = () =>
  http<RentedVehicleResponseType[]>(
    "https://dummyjson.com/c/fd99-532e-4733-83a3"
  );
