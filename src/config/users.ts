import { ROLES } from "./roles";

export const DUMMY_USERS = [
  {
    username: "counter",
    password: "counter123",
    role: ROLES.COUNTER_AGENT,
  },
  {
    username: "system",
    password: "system123",
    role: ROLES.SYSTEM_ADMIN,
  },
  {
    username: "fleet",
    password: "fleet123",
    role: ROLES.FLEET_MANAGER,
  },
  {
    username: "super",
    password: "super123",
    role: ROLES.SUPER_ADMIN,
  }
];
