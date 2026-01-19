import { Car, LayoutDashboard } from "lucide-react";
import type { NavigationGroup } from "@dash/mfe-types";

export const navigation: NavigationGroup[] = [
  {
    id: "counter-functions",
    label: "Counter Functions",
    icon: LayoutDashboard,
    order: 10,
    items: [
      {
        label: "Rent",
        icon: Car,
        pathname: "/rent",
      },
      { label: "GS Start Rent" },
      { label: "Select GS Res List" },
      { label: "Post Rent" },
      { label: "Select Res Manifest" },
      { label: "Non-Move Exchange" },
      { label: "Vehicle Exchange", pathname: "/vehicle_exchange" },
      { label: "Update Opt Services" },
      { label: "Platinum Pre-Print" },
      { label: "Platinum Complete" },
      { label: "Incomplete RR List" },
      { label: "Complete Rental" },
    ],
  },
];
