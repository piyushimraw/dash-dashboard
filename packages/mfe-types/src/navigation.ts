/**
 * Navigation Types
 *
 * Defines the navigation structure for shell sidebar and MFE routing.
 */

export interface NavigationItem {
  /** Unique identifier for the navigation item */
  id: string;

  /** Display label */
  label: string;

  /** Route path */
  path: string;

  /** Icon identifier (e.g., Lucide icon name) */
  icon?: string;

  /** Roles allowed to see this item */
  allowedRoles?: string[];

  /** Badge count (e.g., for notifications) */
  badge?: number;

  /** Whether this item is disabled */
  disabled?: boolean;

  /** Sub-items for nested navigation */
  children?: NavigationItem[];
}

export interface NavigationGroup {
  /** Group identifier */
  id: string;

  /** Group label (optional, for section headers) */
  label?: string;

  /** Navigation items in this group */
  items: NavigationItem[];

  /** Roles allowed to see this group */
  allowedRoles?: string[];

  /** Display order */
  order?: number;
}
