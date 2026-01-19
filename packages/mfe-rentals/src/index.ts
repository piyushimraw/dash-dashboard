// Navigation registration
export { navigation } from "./navigation";

// Dialog registration
export { dialogs } from "./dialogs";

// Pages
export { default as RentPage } from "./pages/RentPage";

// Dialog components (for direct import if needed)
export { default as RentNewVehicleDialog } from "./dialogs/rent-new-vehicle";

// Forms
export { RentVehicleForm, rentVehicleSchema } from "./forms/rent";
export type { RentVehicleFormValues } from "./forms/rent";

// Features
export {
  useGetRentedVehicleList,
  getRentedVehicleList,
  type RentedVehicleResponseType,
} from "./features/rent-vehicle";
