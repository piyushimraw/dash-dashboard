# Contracts

This document defines the type contracts and event bus events used for cross-MFE communication in the new-dash-ui application.

All contracts are defined in TypeScript in the `packages/` directory, providing compile-time verification.

---

## Event Bus

The event bus enables loose coupling between MFEs. It uses [mitt](https://github.com/developit/mitt) - a tiny (~200b) typed event emitter.

**Package:** `packages/event-bus`

### Usage

```typescript
import { eventBus } from '@packages/event-bus';

// Emit an event
eventBus.emit('notification:show', {
  type: 'success',
  message: 'Reservation saved!'
});

// Subscribe to events
const unsubscribe = eventBus.on('notification:show', (event) => {
  console.log(event.type, event.message);
});

// Unsubscribe when done
unsubscribe();
// or: eventBus.off('notification:show', handler);
```

### Events

#### `navigation:change`

Request the shell to navigate to a different route.

```typescript
interface NavigationEvent {
  path: string;              // Target path (e.g., '/rent')
  state?: Record<string, unknown>; // Optional route state
}
```

**Example:**
```typescript
// Navigate from Reservation Lookup to Rent with pre-filled data
eventBus.emit('navigation:change', {
  path: '/rent',
  state: { reservationId: '12345', customerId: 'C-001' }
});
```

**Use cases:**
- Cross-MFE navigation (Reservation Lookup -> Rent)
- Deep linking from notifications
- Programmatic navigation from business logic

---

#### `data:refresh`

Request that data for a specific entity be refetched.

```typescript
interface DataRefreshEvent {
  entity: string;           // Entity type (e.g., 'reservations', 'vehicles')
  id?: string | number;     // Optional specific entity ID
}
```

**Example:**
```typescript
// Refresh all reservations after creating a new one
eventBus.emit('data:refresh', { entity: 'reservations' });

// Refresh a specific vehicle after status change
eventBus.emit('data:refresh', { entity: 'vehicles', id: 'V-12345' });
```

**Use cases:**
- Invalidate React Query cache across MFEs
- Sync data after cross-MFE operations
- Real-time update triggers

---

#### `notification:show`

Display a toast notification to the user.

```typescript
interface NotificationEvent {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;        // Auto-dismiss in ms (default: 5000)
}
```

**Example:**
```typescript
// Success notification
eventBus.emit('notification:show', {
  type: 'success',
  message: 'Rental agreement created successfully'
});

// Error with longer duration
eventBus.emit('notification:show', {
  type: 'error',
  message: 'Failed to process payment. Please try again.',
  duration: 10000
});
```

**Use cases:**
- Operation success/failure feedback
- Validation errors
- System status updates

---

#### `auth:state-changed`

Broadcast authentication state changes.

```typescript
interface AuthStateChangedEvent {
  isAuthenticated: boolean;
  user?: {
    id: string;
    name: string;
    role: string;
  };
}
```

**Example:**
```typescript
// After successful login
eventBus.emit('auth:state-changed', {
  isAuthenticated: true,
  user: { id: 'U-001', name: 'John Doe', role: 'counter_agent' }
});

// After logout
eventBus.emit('auth:state-changed', {
  isAuthenticated: false
});
```

**Use cases:**
- Sync auth state across MFEs
- Trigger cleanup on logout
- Update UI based on user role changes

---

## Type Contracts

**Package:** `packages/mfe-types`

### Authentication Types

#### Role

Available user roles in the system.

```typescript
type Role = 'counter_agent' | 'system_admin' | 'fleet_manager' | 'super_admin';
```

| Role | Description | Access |
|------|-------------|--------|
| `counter_agent` | Front desk staff | Rent, Return, Reservation Lookup, Vehicle Exchange, Dashboard |
| `fleet_manager` | Vehicle fleet management | Car Control, AAO, Dashboard |
| `system_admin` | System configuration | Reports, Settings |
| `super_admin` | Full access | All MFEs |

---

#### User

Authenticated user information.

```typescript
interface User {
  id: string;        // Unique user identifier
  username: string;  // User's username
  role: Role;        // Assigned role
}
```

---

#### AuthState

Current authentication state.

```typescript
interface AuthState {
  isAuthenticated: boolean;  // Whether user is logged in
  user: User | null;         // Current user (null if not authenticated)
  isLoading: boolean;        // True during auth check/refresh
}
```

---

#### AuthService

Authentication service interface (implemented by shell).

```typescript
interface AuthService {
  getState(): AuthState;
  subscribe(callback: (state: AuthState) => void): () => void;
  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  hasRole(role: Role): boolean;
  hasAnyRole(roles: Role[]): boolean;
  refresh(): Promise<void>;
}
```

**Example usage in MFE:**
```typescript
import { useAuth } from '@/hooks/useAuth';

function RentPage() {
  const auth = useAuth();

  if (!auth.hasRole('counter_agent')) {
    return <AccessDenied />;
  }

  return <RentWorkflow />;
}
```

---

### MFE Registry Types

#### MfeLoadingState

Loading states for MFE lifecycle.

```typescript
type MfeLoadingState = 'idle' | 'loading' | 'loaded' | 'error';
```

| State | Description |
|-------|-------------|
| `idle` | Not yet loaded |
| `loading` | Currently loading (chunk download in progress) |
| `loaded` | Successfully loaded and rendered |
| `error` | Failed to load |

---

#### MfeMetadata

Metadata for registered MFEs.

```typescript
interface MfeMetadata {
  id: string;              // Unique identifier (e.g., 'mfe-rent')
  name: string;            // Display name (e.g., 'Rent')
  path: string;            // Route path (e.g., '/rent')
  allowedRoles: string[];  // Roles that can access
  state: MfeLoadingState;  // Current loading state
  error?: string;          // Error message if state is 'error'
  icon?: string;           // Icon identifier for navigation
  description?: string;    // Tooltip/help text
}
```

---

#### MfeRegistry

Interface for MFE registration and management.

```typescript
interface MfeRegistry {
  register(metadata: Omit<MfeMetadata, 'state'>): void;
  unregister(id: string): void;
  getAll(): MfeMetadata[];
  get(id: string): MfeMetadata | undefined;
  updateState(id: string, state: MfeLoadingState, error?: string): void;
  getByRole(role: string): MfeMetadata[];
}
```

---

### Navigation Types

#### NavigationItem

Individual navigation item.

```typescript
interface NavigationItem {
  id: string;               // Unique identifier
  label: string;            // Display label
  path: string;             // Route path
  icon?: string;            // Lucide icon name
  allowedRoles?: string[];  // Role-based visibility
  badge?: number;           // Notification badge count
  disabled?: boolean;       // Disabled state
  children?: NavigationItem[]; // Sub-navigation items
}
```

**Example:**
```typescript
const rentNavItem: NavigationItem = {
  id: 'rent',
  label: 'Rent',
  path: '/rent',
  icon: 'Car',
  allowedRoles: ['counter_agent', 'super_admin']
};
```

---

#### NavigationGroup

Group of navigation items (for sidebar sections).

```typescript
interface NavigationGroup {
  id: string;               // Group identifier
  label?: string;           // Section header (optional)
  items: NavigationItem[];  // Items in this group
  allowedRoles?: string[];  // Role-based visibility
  order?: number;           // Display order
}
```

---

### Dialog Types

#### DialogSize

Available dialog sizes.

```typescript
type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
```

---

#### DialogDefinition

Definition for cross-MFE dialogs.

```typescript
interface DialogDefinition {
  id: string;                    // Unique dialog ID
  title: string;                 // Header title
  size?: DialogSize;             // Dialog size (default: 'md')
  closeOnOutsideClick?: boolean; // Close on backdrop click
  closeable?: boolean;           // Show close button
  component: string;             // Component identifier
  props?: Record<string, unknown>; // Props for component
}
```

---

#### DialogState

Current dialog state.

```typescript
interface DialogState {
  isOpen: boolean;           // Whether dialog is open
  dialog: DialogDefinition | null; // Active dialog
  result?: unknown;          // Result when dialog closes
}
```

---

## Import Examples

```typescript
// Event bus
import { eventBus } from '@packages/event-bus';
import type {
  MfeEvents,
  NavigationEvent,
  DataRefreshEvent,
  NotificationEvent,
  AuthStateChangedEvent
} from '@packages/event-bus';

// Type contracts
import type {
  Role,
  User,
  AuthState,
  AuthService
} from '@packages/mfe-types';

import type {
  MfeLoadingState,
  MfeMetadata,
  MfeRegistry
} from '@packages/mfe-types';

import type {
  NavigationItem,
  NavigationGroup
} from '@packages/mfe-types';

import type {
  DialogSize,
  DialogDefinition,
  DialogState
} from '@packages/mfe-types';
```

---

## Related Documentation

- [ARCHITECTURE.md](../ARCHITECTURE.md) - Overall MFE architecture
- [README.md](../README.md) - Project quick start
