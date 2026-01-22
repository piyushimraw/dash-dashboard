import type { Role } from '@packages/mfe-types';

export type { Role };

export const ROLES = {
  COUNTER_AGENT: 'counter_agent' as Role,
  SYSTEM_ADMIN: 'system_admin' as Role,
  FLEET_MANAGER: 'fleet_manager' as Role,
  SUPER_ADMIN: 'super_admin' as Role,
} as const;

// Role hierarchy for permission checks
export const ROLE_HIERARCHY: Record<Role, number> = {
  super_admin: 4,
  fleet_manager: 3,
  system_admin: 3,
  counter_agent: 2,
};
