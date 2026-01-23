# Architecture Patterns: Build-Time Microfrontend System

**Domain:** Build-time microfrontend architecture with monorepo
**Researched:** 2026-01-22
**Confidence:** HIGH

## Executive Summary

Build-time microfrontend composition in a monorepo produces a single deployable artifact while maintaining development boundaries between teams. Unlike runtime composition (Module Federation at runtime), build-time integration compiles all microfrontends together during CI, creating predictable performance characteristics and simpler deployment at the cost of independent deployability.

**Key architectural insight:** The shell application acts as both orchestrator and service provider. It owns routing, authentication, shared UI components, and cross-cutting concerns, while individual MFEs are "thin" - focused on domain logic rather than infrastructure.

**For this project:** With React 19, Vite, TanStack Router, and 9 MFEs, the architecture should emphasize clear boundaries between shell responsibilities (routing, auth, UI library, API client, event bus) and MFE responsibilities (domain features, internal state).

## Recommended Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      SHELL APPLICATION                       │
│  ┌─────────────┐ ┌──────────────┐ ┌────────────────────┐   │
│  │   Router    │ │     Auth     │ │   UI Component     │   │
│  │  (TanStack) │ │   Service    │ │     Library        │   │
│  └─────────────┘ └──────────────┘ └────────────────────┘   │
│  ┌─────────────┐ ┌──────────────┐ ┌────────────────────┐   │
│  │  API Client │ │  Event Bus   │ │  Layout/Navigation │   │
│  └─────────────┘ └──────────────┘ └────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
        ┌─────▼─────┐   ┌────▼────┐    ┌────▼────┐
        │   MFE 1   │   │  MFE 2  │    │  MFE N  │
        │ (Feature) │   │(Feature)│... │(Feature)│
        │           │   │         │    │         │
        │ - Views   │   │ - Views │    │ - Views │
        │ - State   │   │ - State │    │ - State │
        │ - Logic   │   │ - Logic │    │ - Logic │
        └───────────┘   └─────────┘    └─────────┘
              │               │               │
              └───────────────┼───────────────┘
                              │
                    ┌─────────▼─────────┐
                    │    Event Bus      │
                    │  (Cross-MFE)      │
                    │  Communication    │
                    └───────────────────┘
```

### Component Boundaries

| Component | Responsibility | Owns | Depends On |
|-----------|---------------|------|------------|
| **Shell** | Orchestration, infrastructure | Routing config, auth state, UI library, API client, event bus, layout | None (root) |
| **Router (Shell)** | Top-level route definition, lazy loading orchestration | Route tree, MFE mounting points | Shell |
| **Auth Service (Shell)** | Token management, auth state, request interceptor | JWT tokens, user state, refresh logic | Shell, API Client |
| **UI Library (Shell)** | Shared components, design system | Button, Input, Modal, etc. components, theme | Shell |
| **API Client (Shell)** | HTTP abstraction, auth header injection | Axios/Fetch wrapper, interceptors | Shell, Auth Service |
| **Event Bus (Shell)** | Cross-MFE communication | Pub/sub implementation, event registry | Shell |
| **MFE (Feature)** | Domain-specific feature implementation | Views, domain state, business logic | Shell services (read-only) |
| **MFE Internal Router** | Internal routes within MFE boundary | Sub-routes for MFE features | Shell Router, MFE |

### Dependency Rules

**CRITICAL:** Dependencies flow in ONE direction only:

```
Shell → MFE (allowed)
MFE → Shell services (allowed, read-only)
MFE → MFE (FORBIDDEN - use Event Bus)
```

**Shell provides, MFEs consume:**
- MFEs import from shell packages (UI components, API client, event bus)
- MFEs NEVER import from other MFEs
- MFEs communicate via event bus ONLY

## Data Flow Architecture

### 1. Initial Load & Authentication

```
1. User visits app
2. Shell loads → Auth check
3. If authenticated:
   - Auth service provides token + user state
   - Shell renders layout + navigation
   - Router waits for user interaction
4. If not authenticated:
   - Redirect to login
   - On success, token stored in shell auth service
   - Proceed to step 3
```

### 2. Route-Based MFE Loading

```
1. User navigates to /dashboard
2. TanStack Router matches route
3. Router lazy-loads MFE chunk using lazyRouteComponent()
4. MFE component mounts
5. MFE can:
   - Use shell UI components (import)
   - Use shell API client (import)
   - Publish events to event bus (import)
   - Subscribe to events from event bus (import)
```

**Example with TanStack Router:**

```typescript
// Shell: Route definition
import { createLazyFileRoute } from '@tanstack/router'

export const Route = createFileRoute('/dashboard')({
  // Critical: route metadata
})

// Separate lazy file: dashboard.lazy.tsx
export const Route = createLazyFileRoute('/dashboard')({
  component: lazyRouteComponent(() =>
    import('@mfe/dashboard').then(m => m.DashboardMFE)
  ),
})
```

### 3. API Communication Flow

```
1. MFE needs data
2. MFE calls shell API client:
   apiClient.get('/endpoint')
3. API client intercepts request
4. Auth service injects token header
5. Request sent to backend
6. Response returned to MFE
7. MFE updates internal state
```

**Key principle:** MFE never sees raw token, never manages auth lifecycle.

### 4. Cross-MFE Communication Flow

```
1. MFE A publishes event:
   eventBus.publish('order.created', { orderId: 123 })
2. Event bus broadcasts to subscribers
3. MFE B (subscribed) receives event:
   eventBus.subscribe('order.created', handler)
4. MFE B updates its UI based on event data
```

**Key principle:** MFEs are loosely coupled. Event bus ensures no direct dependencies.

## Monorepo Structure

```
/
├── apps/
│   └── shell/                    # Shell application
│       ├── src/
│       │   ├── main.tsx          # Entry point
│       │   ├── router/           # TanStack Router config
│       │   │   ├── routes/       # Route definitions
│       │   │   │   ├── __root.tsx
│       │   │   │   ├── index.tsx
│       │   │   │   ├── dashboard.tsx
│       │   │   │   └── dashboard.lazy.tsx
│       │   │   └── router.ts
│       │   ├── services/
│       │   │   ├── auth.ts       # Auth service
│       │   │   └── event-bus.ts  # Event bus
│       │   └── layout/
│       │       └── AppLayout.tsx # Shell layout
│       ├── vite.config.ts        # Build config
│       └── package.json
│
├── packages/
│   ├── ui/                       # Shared UI component library
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Button/
│   │   │   │   ├── Input/
│   │   │   │   └── Modal/
│   │   │   ├── theme/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── api-client/               # Shared API client
│   │   ├── src/
│   │   │   ├── client.ts         # Axios/Fetch wrapper
│   │   │   ├── interceptors.ts   # Auth header injection
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── event-bus/                # Event bus implementation
│   │   ├── src/
│   │   │   ├── bus.ts            # Pub/sub logic
│   │   │   ├── types.ts          # Event type definitions
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── types/                    # Shared TypeScript types
│       ├── src/
│       │   ├── auth.ts
│       │   ├── api.ts
│       │   └── events.ts
│       └── package.json
│
├── mfes/
│   ├── dashboard/                # MFE 1: Dashboard
│   │   ├── src/
│   │   │   ├── index.tsx         # MFE entry
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── state/
│   │   └── package.json
│   │
│   ├── orders/                   # MFE 2: Orders
│   │   └── ...
│   │
│   └── [7 more MFEs]/
│
├── package.json                  # Root package.json
├── pnpm-workspace.yaml           # Monorepo workspace config
└── turbo.json                    # Build orchestration (optional)
```

## Build Order & Dependencies

### Phase 1: Foundation (Build First)

**Order matters** - these must be built before anything depends on them.

```
1. @packages/types       (no dependencies)
2. @packages/event-bus   (depends on: types)
3. @packages/api-client  (depends on: types)
4. @packages/ui          (depends on: types)
```

**Rationale:** Shared packages are pure libraries. No circular dependencies. MFEs and shell will import these.

### Phase 2: MFEs (Build in Parallel)

```
All 9 MFEs can build in parallel:
- @mfes/dashboard
- @mfes/orders
- @mfes/inventory
- ... (6 more)
```

**Rationale:** MFEs are independent. No MFE imports another MFE. Each only depends on shared packages.

**Key constraint:** MFEs export React components, not full applications. The shell orchestrates rendering.

### Phase 3: Shell (Build Last)

```
1. @apps/shell (depends on: all packages, all MFEs)
```

**Rationale:** Shell imports MFE entry points for lazy loading. Must build after MFEs exist.

**Build output:** Single optimized bundle with code-split chunks per MFE.

### Dependency Graph

```
              types
                │
        ┌───────┼───────┬───────┐
        │       │       │       │
    event-bus  api  ui-library │
        │       │       │       │
        └───────┼───────┴───────┘
                │
        ┌───────┼────────┬── ... ──┐
        │       │        │         │
     MFE-1   MFE-2    MFE-3     MFE-9
        │       │        │         │
        └───────┼────────┴─────────┘
                │
              Shell
```

### Build Tool Configuration

**Vite configuration for Shell:**

```typescript
// apps/shell/vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router': ['@tanstack/router'],

          // Shared packages
          'ui-library': ['@packages/ui'],
          'api-client': ['@packages/api-client'],

          // Each MFE gets its own chunk
          'mfe-dashboard': ['@mfes/dashboard'],
          'mfe-orders': ['@mfes/orders'],
          // ... etc for each MFE
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      '@packages/ui',
      '@packages/api-client',
      '@packages/event-bus'
    ]
  }
})
```

**Package workspace dependencies:**

```json
// apps/shell/package.json
{
  "dependencies": {
    "react": "^19.0.0",
    "@tanstack/router": "^1.x",
    "@packages/ui": "workspace:*",
    "@packages/api-client": "workspace:*",
    "@packages/event-bus": "workspace:*",
    "@mfes/dashboard": "workspace:*",
    "@mfes/orders": "workspace:*"
    // ... all 9 MFEs
  }
}
```

**Monorepo task orchestration:**

```json
// turbo.json or nx.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],  // Build dependencies first
      "outputs": ["dist/**"]
    }
  }
}
```

This ensures packages → MFEs → shell build order automatically.

## Patterns to Follow

### Pattern 1: Shell-Owned Services

**What:** Infrastructure services (auth, API, events) live in shell, exported to MFEs.

**When:** Always, for cross-cutting concerns.

**Example:**

```typescript
// packages/api-client/src/client.ts
import { authService } from '@apps/shell/services/auth'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

// Auth interceptor - shell injects token
apiClient.interceptors.request.use((config) => {
  const token = authService.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

```typescript
// mfes/dashboard/src/components/DashboardWidget.tsx
import { apiClient } from '@packages/api-client'

export function DashboardWidget() {
  const { data } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => apiClient.get('/dashboard/stats')  // Token auto-injected
  })

  return <div>{data.value}</div>
}
```

**Why:** MFEs never touch tokens. Security boundary enforced at architecture level.

### Pattern 2: Event-Driven MFE Communication

**What:** MFEs publish/subscribe to typed events instead of calling each other directly.

**When:** MFE A needs to notify MFE B of state changes.

**Example:**

```typescript
// packages/event-bus/src/types.ts
export type AppEvents = {
  'order.created': { orderId: string; total: number }
  'inventory.updated': { sku: string; quantity: number }
  'user.profile.changed': { userId: string }
}

// packages/event-bus/src/bus.ts
export class EventBus<Events> {
  private listeners = new Map<keyof Events, Function[]>()

  publish<K extends keyof Events>(event: K, data: Events[K]) {
    this.listeners.get(event)?.forEach(fn => fn(data))
  }

  subscribe<K extends keyof Events>(event: K, fn: (data: Events[K]) => void) {
    const current = this.listeners.get(event) || []
    this.listeners.set(event, [...current, fn])

    return () => {
      // Unsubscribe logic
    }
  }
}

export const eventBus = new EventBus<AppEvents>()
```

```typescript
// mfes/orders/src/components/OrderForm.tsx
import { eventBus } from '@packages/event-bus'

function OrderForm() {
  const handleSubmit = async (order) => {
    await apiClient.post('/orders', order)
    eventBus.publish('order.created', { orderId: order.id, total: order.total })
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

```typescript
// mfes/inventory/src/components/InventoryAlert.tsx
import { eventBus } from '@packages/event-bus'
import { useEffect, useState } from 'react'

function InventoryAlert() {
  const [newOrders, setNewOrders] = useState(0)

  useEffect(() => {
    return eventBus.subscribe('order.created', (data) => {
      setNewOrders(prev => prev + 1)
      // Update inventory UI
    })
  }, [])

  return <Badge>{newOrders} new orders</Badge>
}
```

**Why:** Loose coupling. MFEs can be developed/deployed independently. Adding MFE C doesn't require changing A or B.

### Pattern 3: Lazy Route Component Loading

**What:** Each MFE route is code-split into separate chunk, loaded on-demand.

**When:** Always. Reduces initial bundle size.

**Example:**

```typescript
// apps/shell/src/router/routes/dashboard.tsx (critical route config)
import { createFileRoute } from '@tanstack/router'

export const Route = createFileRoute('/dashboard')({
  // Only critical metadata here - fast to parse
  beforeLoad: async ({ context }) => {
    // Auth check, etc.
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  }
})
```

```typescript
// apps/shell/src/router/routes/dashboard.lazy.tsx (lazy loaded)
import { createLazyFileRoute } from '@tanstack/router'

export const Route = createLazyFileRoute('/dashboard')({
  component: DashboardPage  // This is lazy loaded
})

function DashboardPage() {
  // Lazy import MFE
  const { DashboardMFE } = await import('@mfes/dashboard')
  return <DashboardMFE />
}
```

**Alternative approach with lazyRouteComponent:**

```typescript
// apps/shell/src/router/routes/dashboard.lazy.tsx
import { createLazyFileRoute, lazyRouteComponent } from '@tanstack/router'

export const Route = createLazyFileRoute('/dashboard')({
  component: lazyRouteComponent(() =>
    import('@mfes/dashboard').then(m => m.DashboardMFE)
  )
})
```

**Why:** TanStack Router separates critical route config (auth, loaders) from component code. Fast initial parse, lazy component load.

### Pattern 4: Shared UI Component Library

**What:** All visual components (buttons, inputs, modals) live in @packages/ui, used by all MFEs.

**When:** Always. Ensures visual consistency.

**Example:**

```typescript
// packages/ui/src/components/Button/Button.tsx
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
}

export function Button({ variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      {...props}
    />
  )
}
```

```typescript
// packages/ui/src/index.ts
export { Button } from './components/Button'
export { Input } from './components/Input'
export { Modal } from './components/Modal'
// ... all shared components

// Also export theme
export { theme } from './theme'
```

```typescript
// mfes/dashboard/src/components/DashboardWidget.tsx
import { Button, Card } from '@packages/ui'

export function DashboardWidget() {
  return (
    <Card>
      <h3>Revenue</h3>
      <Button variant="primary" onClick={handleRefresh}>
        Refresh
      </Button>
    </Card>
  )
}
```

**Why:** Single source of truth for design system. Change button style once, all MFEs update. No visual drift.

### Pattern 5: Thin MFEs, Smart Shell

**What:** MFEs focus on domain logic. Shell provides infrastructure.

**When:** Always. Keeps MFEs lightweight.

**MFE responsibilities (ONLY):**
- Domain-specific UI components
- Internal state management (React Query, Zustand, etc.)
- Business logic for their feature
- Publishing domain events

**MFE should NOT:**
- Manage authentication
- Handle HTTP configuration
- Implement routing (beyond internal sub-routes)
- Manage global state
- Communicate directly with other MFEs

**Shell responsibilities:**
- Authentication & authorization
- Top-level routing
- API client configuration
- Event bus implementation
- Shared UI library
- Layout & navigation
- Error boundaries

**Why:** Clear separation of concerns. MFEs stay simple. Infrastructure complexity centralized.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Direct MFE-to-MFE Imports

**What:** MFE A imports components/functions directly from MFE B.

```typescript
// BAD: Direct import
import { OrderSummary } from '@mfes/orders'

function DashboardWidget() {
  return <OrderSummary orderId="123" />  // WRONG
}
```

**Why bad:** Creates tight coupling. Can't deploy MFE B independently. Circular dependency risk.

**Instead:** Use event bus for communication, or extract shared logic to @packages.

```typescript
// GOOD: Event-driven
eventBus.subscribe('order.updated', (data) => {
  // Update dashboard based on event
})

// OR if truly shared UI: move to @packages/ui
import { OrderSummaryCard } from '@packages/ui'
```

**Detection:** Lint rule to prevent cross-MFE imports:

```json
// .eslintrc.json
{
  "rules": {
    "no-restricted-imports": ["error", {
      "patterns": ["@mfes/*"]  // In MFE code, block all other MFE imports
    }]
  }
}
```

### Anti-Pattern 2: MFEs Managing Authentication

**What:** MFE stores auth token, manages login/logout flow.

```typescript
// BAD: MFE manages auth
function LoginForm() {
  const handleLogin = async (creds) => {
    const { token } = await fetch('/auth/login', { body: creds })
    localStorage.setItem('token', token)  // WRONG: MFE touching token
  }
}
```

**Why bad:**
- Security risk (token exposed to MFE code)
- Duplication (every MFE reimplements auth)
- Inconsistent token handling
- No central logout

**Instead:** Shell owns auth completely.

```typescript
// GOOD: Shell auth service
// apps/shell/src/services/auth.ts
class AuthService {
  private token: string | null = null

  async login(creds) {
    const { token } = await apiClient.post('/auth/login', creds)
    this.token = token
    localStorage.setItem('token', token)
  }

  getToken() {
    return this.token || localStorage.getItem('token')
  }

  async logout() {
    this.token = null
    localStorage.removeItem('token')
    // Navigate to login
  }
}

export const authService = new AuthService()
```

```typescript
// MFE only reads auth STATE (not token)
import { useAuth } from '@apps/shell/hooks/useAuth'

function DashboardWidget() {
  const { user, isAuthenticated } = useAuth()  // State only

  if (!isAuthenticated) return null
  return <div>Welcome {user.name}</div>
}
```

### Anti-Pattern 3: Shared State via Window Object

**What:** MFEs communicate by setting `window.globalState = { ... }`.

```typescript
// BAD: Window globals
function OrderForm() {
  const handleSubmit = async (order) => {
    await createOrder(order)
    window.globalState.lastOrder = order  // WRONG: Implicit coupling
  }
}

function InventoryWidget() {
  const lastOrder = window.globalState?.lastOrder  // WRONG: Fragile
}
```

**Why bad:**
- No type safety
- Implicit coupling (who's reading what?)
- Memory leaks (who clears old data?)
- Race conditions
- Debugging nightmare

**Instead:** Explicit event bus.

```typescript
// GOOD: Typed events
eventBus.publish('order.created', { orderId: '123', sku: 'ABC' })

// In other MFE
eventBus.subscribe('order.created', ({ orderId, sku }) => {
  // Type-safe, explicit
})
```

### Anti-Pattern 4: No Build Order Enforcement

**What:** Shell and MFEs build in arbitrary order. Sometimes shell builds before MFEs exist.

**Why bad:**
- Build failures in CI
- "Cannot find module" errors
- Inconsistent local dev vs CI

**Instead:** Use monorepo task orchestration.

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"]  // Build dependencies first
    }
  }
}
```

Or with pnpm:

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'mfes/*'
  - 'apps/*'

# package.json scripts
{
  "scripts": {
    "build": "pnpm -r --workspace-concurrency=3 build"
    // --workspace-concurrency: packages → MFEs (parallel) → shell
  }
}
```

### Anti-Pattern 5: God MFE

**What:** One MFE grows to cover multiple domains. "Orders MFE" also handles shipping, inventory, and returns.

**Why bad:**
- Defeats purpose of MFE architecture
- Large bundle size (negates lazy loading benefits)
- Team boundaries blur
- Hard to reason about scope

**Instead:** Split into focused MFEs.

```
BAD:
- orders (handles orders, shipping, inventory, returns)

GOOD:
- orders (order creation/management only)
- shipping (tracking, labels)
- inventory (stock levels)
- returns (RMA process)
```

**Rule of thumb:** Each MFE should be owned by one team, serve one domain, fit in one developer's head.

### Anti-Pattern 6: Premature Optimization - Too Many MFEs

**What:** Creating 50 MFEs for a small app. Every feature is its own MFE.

**Why bad:**
- Overhead of monorepo coordination
- Complexity without benefit
- Slow build times (too many packages)
- Communication overhead (events everywhere)

**Instead:** Start with fewer, cohesive MFEs. Split later if needed.

**For this project:** 9 MFEs seems reasonable IF each represents a distinct feature domain. If some are very small, consider combining related features.

### Anti-Pattern 7: Mixing Build-Time and Runtime Composition

**What:** Some MFEs use build-time (bundled with shell), others use runtime (Module Federation).

**Why bad:**
- Two different loading mechanisms
- Inconsistent DX
- Hard to debug ("Why does MFE A load differently than B?")
- Shared dependency version conflicts

**Instead:** Pick ONE composition strategy. For this project: build-time (single artifact).

## Scalability Considerations

| Concern | At 10 Users | At 1K Users | At 100K Users |
|---------|-------------|-------------|---------------|
| **Initial Bundle Size** | Shell + shared libs (~200KB). MFEs lazy loaded. | Same. Route-based loading means users only download what they use. | Same. Lazy loading is key. Consider adding route prefetching on hover. |
| **API Performance** | Shell's API client is thin wrapper. Backend is bottleneck. | Add request deduplication in API client (React Query handles this). | Add caching layer (React Query cache, service worker). |
| **Event Bus Memory** | No issues. Events are fire-and-forget. | Add event cleanup on unmount. Weak references for long-lived subscriptions. | Consider event replay limits, memory profiling. |
| **Build Time** | Fast (~30s for full build). | Moderate (~2-3min as MFEs grow). Add Turborepo/Nx for caching. | Slow (5min+). Use remote caching (Turborepo Remote Cache, Nx Cloud). Parallelize builds. |
| **Deployment** | Single deploy. Simple. | Same. One artifact = one deploy. | Same. But add staged rollout (canary, blue-green). |
| **MFE Size** | Each MFE < 50KB gzipped. | Monitor bundle sizes. Add bundle analysis (rollup-plugin-visualizer). | Split large MFEs further. Add code splitting within MFEs. |
| **Shared Dependency Updates** | Update React 19 → 19.1, rebuild all. Simple. | Same, but longer build. | Requires full regression testing. Consider automated visual regression (Chromatic, Percy). |

## Build-Time vs Runtime Tradeoffs

Since this project uses **build-time composition**, here are the implications:

### Advantages of Build-Time (Your Choice)

✅ **Predictable performance:** Everything bundled together, no runtime module loading overhead.

✅ **Simpler deployment:** Single artifact. One build, one deploy.

✅ **Better initial load:** Shared dependencies optimized together (tree-shaking across MFEs).

✅ **Easier debugging:** Source maps reference one bundle, not multiple remotes.

✅ **No version conflicts:** Build fails if MFE A expects React 19.0 but MFE B has 19.1.

### Disadvantages of Build-Time

❌ **No independent deployment:** Updating one MFE requires rebuilding and redeploying entire shell.

❌ **Longer build times:** All 9 MFEs + shell must build together.

❌ **Team coordination required:** If MFE A breaks, entire build fails. Can't deploy MFE B independently.

❌ **Version lock-in:** All MFEs must use same React version, same @packages/ui version.

### When Build-Time is Right (Your Case)

✅ If teams are small and coordinated (shared release cycle is OK)

✅ If deployment simplicity > deployment independence

✅ If performance consistency > flexibility

✅ If monorepo discipline is high (good testing, CI practices)

### When Runtime (Module Federation) Would Be Better

- Large org with independent teams, different release schedules
- Need to deploy MFE A without touching MFE B
- Polyglot frontend (mixing React, Vue, Angular MFEs)
- Very large app where initial bundle size is critical

**For this project:** Build-time is appropriate IF deployment coordination is acceptable. If later you need independent deploys, migration to Module Federation is possible (but significant refactor).

## Implementation Strategy

### Phase 1: Foundation (Week 1-2)

**Goal:** Set up monorepo structure, build shared packages.

**Build order:**
1. Create monorepo structure (pnpm workspace or Turborepo)
2. Scaffold `@packages/types` (shared TypeScript interfaces)
3. Build `@packages/event-bus` (pub/sub implementation)
4. Build `@packages/api-client` (Axios wrapper with interceptors)
5. Build `@packages/ui` (component library - start with 5-10 core components)

**Success criteria:**
- Each package builds independently
- Packages can import each other (`api-client` imports `types`)
- Unit tests pass

**Validation:**
```bash
pnpm -r build  # All packages build
pnpm -r test   # All tests pass
```

### Phase 2: Shell Core (Week 2-3)

**Goal:** Build shell with routing and auth, no MFEs yet.

**Steps:**
1. Create `apps/shell` with Vite + React 19
2. Set up TanStack Router with route tree
3. Implement auth service (login/logout, token management)
4. Create layout component (header, nav, footer)
5. Connect API client to auth service (interceptors)
6. Add placeholder routes for each future MFE

**Success criteria:**
- Shell loads and renders
- Login/logout works
- Protected routes redirect if not authenticated
- API calls include auth header

**Validation:**
- Can navigate to `/` (home)
- Can login, see user state
- Navigate to `/dashboard` shows placeholder

### Phase 3: First MFE (Proof of Concept) (Week 3)

**Goal:** Prove build-time MFE integration works.

**Steps:**
1. Scaffold `mfes/dashboard` package
2. Create simple Dashboard component
3. Export component from `@mfes/dashboard`
4. Update shell route to lazy load Dashboard MFE
5. Verify code splitting (dashboard chunk generated)

**Success criteria:**
- Dashboard MFE loads when navigating to `/dashboard`
- Network tab shows separate chunk downloaded
- Dashboard can use `@packages/ui` components
- Dashboard can call `@packages/api-client`

**Validation:**
```bash
pnpm build
# Check dist/assets/ - should see dashboard.chunk.js
```

Navigate to `/dashboard`, verify:
- Dashboard loads
- Uses shared Button component from @packages/ui
- Can fetch data via API client

### Phase 4: Remaining MFEs (Week 4-6)

**Goal:** Build all 9 MFEs.

**Strategy:**
- Use Dashboard MFE as template
- Scaffold remaining 8 MFEs
- Parallel development (can build MFEs in parallel)

**For each MFE:**
1. Create `mfes/[name]` package
2. Implement core feature UI
3. Add shell route for MFE
4. Wire up any cross-MFE events via event bus

**Success criteria:**
- All 9 MFEs load on their routes
- Each generates separate chunk
- MFEs can communicate via event bus

### Phase 5: Polish & Optimization (Week 7-8)

**Goal:** Production-ready build.

**Steps:**
1. Add manual chunk splitting (vendor, shared, MFE chunks)
2. Configure Vite build optimizations
3. Add bundle size monitoring
4. Implement error boundaries per MFE
5. Add loading states for lazy routes
6. Performance testing (Lighthouse)

**Success criteria:**
- Initial bundle < 300KB gzipped
- Each MFE chunk < 100KB gzipped
- Lazy routes load in < 200ms
- Lighthouse score > 90

## Configuration Examples

### Vite Config (Shell)

```typescript
// apps/shell/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite()  // Generates route tree
  ],

  resolve: {
    alias: {
      '@packages': '/packages',
      '@mfes': '/mfes'
    }
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunk
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
            if (id.includes('@tanstack/router')) {
              return 'router'
            }
            return 'vendor'
          }

          // Shared packages
          if (id.includes('/packages/ui')) return 'ui-library'
          if (id.includes('/packages/api-client')) return 'api-client'
          if (id.includes('/packages/event-bus')) return 'event-bus'

          // MFE chunks
          if (id.includes('/mfes/dashboard')) return 'mfe-dashboard'
          if (id.includes('/mfes/orders')) return 'mfe-orders'
          // ... etc for each MFE
        }
      }
    },

    // Optimize chunk size
    chunkSizeWarningLimit: 500,  // Warn if chunk > 500KB
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@tanstack/router',
      '@packages/ui',
      '@packages/api-client',
      '@packages/event-bus'
    ]
  }
})
```

### TanStack Router Config (Shell)

```typescript
// apps/shell/src/router/router.ts
import { createRouter } from '@tanstack/router'
import { routeTree } from './routeTree.gen'  // Auto-generated
import { authService } from '../services/auth'

export const router = createRouter({
  routeTree,
  context: {
    auth: authService,
    eventBus
  },
  defaultPreload: 'intent',  // Preload on hover
  defaultPreloadDelay: 50
})
```

### Monorepo Workspace

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'mfes/*'
  - 'apps/*'
```

```json
// package.json (root)
{
  "scripts": {
    "dev": "pnpm --filter shell dev",
    "build": "turbo build",
    "build:packages": "pnpm --filter './packages/*' build",
    "build:mfes": "pnpm --filter './mfes/*' build",
    "build:shell": "pnpm --filter shell build",
    "test": "turbo test",
    "lint": "turbo lint"
  },
  "devDependencies": {
    "turbo": "latest",
    "typescript": "^5.0.0"
  }
}
```

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false
    }
  }
}
```

## Confidence Assessment

| Area | Confidence | Rationale |
|------|------------|-----------|
| **Overall Architecture** | HIGH | Build-time composition patterns well-documented. TanStack Router lazy loading verified from official docs. |
| **Component Boundaries** | HIGH | Clear separation of shell vs MFE responsibilities follows industry best practices. Event bus pattern widely adopted. |
| **Build Order** | HIGH | Monorepo tooling (Turborepo, pnpm) handles dependency graphs reliably. Build order is deterministic. |
| **Vite Configuration** | HIGH | Official Vite docs confirm manualChunks approach. Multiple entry points supported. |
| **TanStack Router Integration** | MEDIUM | Official docs confirm lazy loading via `createLazyFileRoute`. Specific MFE integration less documented but follows standard React lazy loading patterns. |
| **Event Bus Implementation** | MEDIUM | Pattern is standard, but implementation details depend on requirements (typed events, replay, persistence). |
| **Scalability Claims** | MEDIUM | Build-time composition scales well for coordinated teams. Bundle size and build time concerns are real at scale. |

## Sources

### Architecture & Patterns
- [Micro Frontends - Martin Fowler](https://martinfowler.com/articles/micro-frontends.html)
- [Microfrontend: Build-Time vs Run-Time Integration](https://engrmuhammadusman108.medium.com/microfrontend-build-time-intergation-vs-run-time-integration-concepts-cc56bddfbc85)
- [How to Compose Micro Frontends at Build Time](https://sharvishi9118.medium.com/how-to-compose-micro-frontends-at-build-time-c5e484a40e10)
- [Complete Micro Frontend Architecture Guide 2025](https://www.altersquare.io/micro-frontend-guide/)
- [Nx Micro Frontend Architecture](https://nx.dev/docs/technologies/module-federation/concepts/micro-frontend-architecture)

### Monorepo & Build Configuration
- [Microfrontends in the Monorepo](https://javascript-conference.com/blog/microfrontends-in-the-monorepo/)
- [Monorepos and microfrontends — going together like pineapples on pizza?](https://hmh.engineering/monorepos-and-microfrontends-going-together-like-pineapples-on-pizza-36855350633d)
- [Micro Frontends with Module Federation in Monorepo](https://michalzalecki.com/micro-frontends-module-federation-monorepo/)

### Vite & Build Optimization
- [Building for Production - Vite Official Docs](https://vite.dev/guide/build)
- [How to Build Micro Frontends in React with Vite and Module Federation](https://www.freecodecamp.org/news/how-to-build-micro-frontends-in-react-with-vite-and-module-federation/)
- [Vite bundle optimization in micro-frontend architecture](https://medium.com/@contact.francescodone/vite-bundle-optimization-f200a8e475be)

### TanStack Router
- [Code Splitting - TanStack Router Docs](https://tanstack.com/router/v1/docs/framework/react/guide/code-splitting)
- [createLazyFileRoute - TanStack Router API](https://tanstack.com/router/latest/docs/framework/react/api/router/createLazyFileRouteFunction)

### Shell Architecture & Cross-Cutting Concerns
- [Building Unified User Interface with Micro frontends — A Shell Architecture Guide](https://medium.com/@rajneesh.madan/building-user-interfaces-with-microfrontends-a-unified-shell-approach-08b3adce7740)
- [Micro Frontend Strategy: Choosing Between Shell Apps and Independent Systems](https://medium.com/beer-and-servers-dont-mix/micro-frontend-strategy-choosing-between-shell-apps-and-independent-systems-2010a1eeec9a)
- [Handling Routing in a Microfrontend Architecture](https://article.arunangshudas.com/handling-routing-in-a-microfrontend-architecture-71472a3ec3d6)

### Authentication & API Patterns
- [React Microfrontend Authentication: Step by Step Guide](https://blog.bitsrc.io/react-microfrontend-authentication-step-by-step-guide-ca4f3947996f)
- [How do you share authentication in micro-frontends](https://dev.to/kleeut/how-do-you-share-authentication-in-micro-frontends-5glc)
- [AWS Prescriptive Guidance - Understanding and implementing microfrontends](https://docs.aws.amazon.com/prescriptive-guidance/latest/micro-frontends-aws/introduction.html)

### Communication Patterns
- [Microfrontend: Best practices and design patterns — Part 2](https://medium.com/@anasstissirallah/microfrontend-best-practices-and-design-patterns-part-2-8455357b27a8)
- [5 Different Techniques for Cross Micro Frontend Communication](https://sharvishi9118.medium.com/cross-micro-frontend-communication-techniques-a10fedc11c59)
- [Cross Micro Frontend Communication - Thoughtworks](https://www.thoughtworks.com/insights/blog/architecture/cross-micro-frontend-communication)

### Design Systems & Shared UI
- [Micro Frontends and Design Systems: How to Achieve Cohesion Across Teams](https://dev.to/dhrumitdk/micro-frontends-and-design-systems-how-to-achieve-cohesion-across-teams-59gi)
- [User Interface & Design System - Micro Frontends in Action](https://livebook.manning.com/book/micro-frontends-in-action/chapter-12/v-4/)

### Anti-Patterns & Pitfalls
- [Top 10 Micro Frontend Anti-Patterns](https://dev.to/florianrappl/top-10-micro-frontend-anti-patterns-3809)
- [Microfrontends Anti-Patterns: Seven Years in the Trenches - InfoQ](https://www.infoq.com/presentations/microfrontend-antipattern/)
- [A Catalog of Micro Frontends Anti-patterns](https://arxiv.org/html/2411.19472v1)
- [Microfrontends should be your last resort](https://www.breck-mckye.com/blog/2023/05/Microfrontends-should-be-your-last-resort/)
