import type { DialogDefinition } from "@dash/mfe-types";
import RentNewVehicleDialog from "./dialogs/rent-new-vehicle";

export const dialogs: DialogDefinition[] = [
  { id: "RENT_VEHICLE", component: RentNewVehicleDialog },
];
