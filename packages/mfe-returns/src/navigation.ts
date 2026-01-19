import { ClipboardList } from "lucide-react";
import type { NavigationGroup } from "@dash/mfe-types";

export const navigation: NavigationGroup[] = [
  {
    id: "counter-functions-returns",
    label: "Counter Functions",
    icon: ClipboardList,
    order: 10,
    items: [
      {
        label: "Return",
        icon: ClipboardList,
        pathname: "/return",
      },
      { label: "Post Return" },
    ],
  },
];
