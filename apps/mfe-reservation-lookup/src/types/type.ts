export interface TableType {
  id: number | string;
  customerName: string;
  serviceLevel: "Gold" | "Silver" | "Platinum";
  cvi: string;
  arrivalLocation: string;
  estArrival: string;
  flightInfoStatus: "On Time" | "Delayed" | "Cancelled";
  numberOfDays: number;
  resClass: "SUV" | "Sedan" | "Hatchback" | "Economy" | "Business";
  resStatus: "Confirmed" | "Completed" | "Cancelled";
  dashStatus: "Active" | "Closed" | "Inactive";
  rentDate: string;
  returnDate: string;
  email: string;
  phone: string;
}

export interface FilterState {
  startDate: string;
  endDate: string;
  status: string;
  arrivalLocation: string;
}
