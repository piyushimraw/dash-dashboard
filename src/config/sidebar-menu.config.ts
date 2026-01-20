
import type { IconKey } from "@/icons/iconKeys";
import { ROLES } from "./roles";

export interface MenuItemType {
  label: string;
  icon?: IconKey;
  children?: { label: string; icon?: IconKey; pathname?: string }[];
  roles: string[];
}

export const menuItems: MenuItemType[] = [
  {
    label: "Counter Functions",
    icon: 'dashboard',
    children: [
      {
        label: "Rent",
        icon: 'car',
        pathname: "/rent",
      },
      {
        label: "Return",
        icon: 'clipboardList',
        pathname: "/return",
      },
      { label: "GS Start Rent" },
      { label: "Select GS Res List" },
      { label: "Post Rent" },
      { label: "Post Return" },
      { label: "Select Res Manifest" },
      { label: "Non-Move Exchange" },
      { label: "Vehicle Exchange", pathname: "/vehicle_exchange" },
      { label: "AAO", pathname: "/aao" },
      { label: "Update Opt Services" },
      { label: "Platinum Pre-Print" },
      { label: "Platinum Complete" },
      { label: "Incomplete RR List" },
      { label: "Complete Rental" },
    ],
    roles: [ROLES.COUNTER_AGENT, ROLES.SUPER_ADMIN],
  },
  {
    label: "Inventory Mgmt",
    icon: 'package',
    children: [
      { label: "Vehicle Status" },
      { label: "Fleet Report" },
      { label: "Vehicle Search" },
    ],
    roles: [ROLES.SUPER_ADMIN, ROLES.FLEET_MANAGER, ROLES.COUNTER_AGENT]
  },
  {
    label: "Information Search",
    icon: 'search',
    children: [
      { label: "Customer Lookup" },
      { label: "Reservation Search" },
      { label: "Rate Inquiry" },
    ],
    roles: [ROLES.SUPER_ADMIN, ROLES.COUNTER_AGENT],
  },
  {
    label: "Admin",
    icon: 'settings',
    children: [
      { label: "User Management" },
      { label: "System Config" },
      { label: "Audit Logs" },
    ],
    roles: [ROLES.SYSTEM_ADMIN, ROLES.SUPER_ADMIN]
  },
  {
    label: "Rental Management",
    icon: 'fileText',
    children: [
      { label: "Rent" },
      { label: "Return" },
      { label: "RA Enquiry" },
      { label: "Post Rent" },
      { label: "Post Return" },
      { label: "Continuous Rental" },
      { label: "Cont.Rental Hist." },
      { label: "Gold Service" },
    ],
    roles: [ROLES.COUNTER_AGENT, ROLES.SUPER_ADMIN]
  },
  {
    label: "Res Processing",
    icon: 'clipboardList',
    children: [
      { label: "New Reservation" },
      { label: "Modify Reservation" },
      { label: "Cancel Reservation" },
    ],
    roles: [ROLES.SUPER_ADMIN, ROLES.COUNTER_AGENT]
  },
  {
    label: "Car Control",
    icon: 'car',
    children: [
      { label: "Check In", pathname: '/carcontrol' },
      { label: "Check Out" },
      { label: "Vehicle Transfer" },
    ],
    roles: [ROLES.FLEET_MANAGER, ROLES.SUPER_ADMIN]
  },
  {
    label: "Reports",
    icon: 'barChart',
    children: [
      { label: "Daily Summary" ,pathname: "/reports", },
      { label: "Revenue Report"},
      { label: "Fleet Utilization"},
    ],
    roles: [ROLES.SUPER_ADMIN, ROLES.FLEET_MANAGER]
  },
  {
    label: "System Admin",
    icon: 'wrench',
    children: [
      { label: "Settings", pathname: '/settings' },
      { label: "Permissions" },
      { label: "Backup" },
    ],
    roles: [ROLES.SYSTEM_ADMIN, ROLES.SUPER_ADMIN]
  },
  {
    label: "Security Menu",
    icon: 'shield',
    children: [
      { label: "Change Password" },
      { label: "Session Management" },
      { label: "Access Control" },
    ],
    roles: [ROLES.SUPER_ADMIN]
  },
];