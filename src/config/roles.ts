export const ROLES = {
  COUNTER_AGENT : 'counter_agent',
  SYSTEM_ADMIN : 'system_admin',
  FLEET_MANAGER : 'fleet_manager',
  SUPER_ADMIN : 'super_admin'
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
