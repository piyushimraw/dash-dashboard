
export type TableType = {
  vehicleId: string;
  customerId: string;
  rentDate: string;
  expectedReturnDate: string;
  pickupLocation: string;
  status: "Approved" | "Pending" | "Rejected";
};
export interface FilterState {
  startDate: string;
  endDate: string;
  status: string;
}