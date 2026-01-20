import type { Role } from "@/config/roles";
import useAuthStore from "@/store/useAuthStore";
import { redirect } from "@tanstack/react-router";

export function requireRole(allowedRoles: Role[]) {
  const { isLoggedIn, role } = useAuthStore.getState();

  if (!isLoggedIn) {
    throw redirect({ to: "/login" });
  }

  if (!role || !allowedRoles.includes(role)) {
    throw redirect({ to: "/unauthorized" });
  }
}
