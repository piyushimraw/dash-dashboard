# Phase 1: Infrastructure - Research

**Researched:** 2026-01-22
**Domain:** Monorepo with pnpm workspaces, TypeScript project references, build-time microfrontends
**Confidence:** HIGH

## Summary

Phase 1 establishes a pnpm workspace monorepo with TypeScript project references for a build-time microfrontend architecture. The standard approach uses pnpm workspaces for package management, TypeScript composite projects for incremental builds, and TanStack Router with automatic code splitting for lazy-loaded routes. The shell orchestrates MFEs through shared packages (UI components, API client, event bus, type contracts) with error boundaries preventing cascade failures.

**Primary recommendation:** Use pnpm workspaces with `workspace:*` protocol, TypeScript project references with `composite: true`, and TanStack Router's automatic code splitting feature enabled in the Vite plugin configuration.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| pnpm | 9.x | Workspace package manager | 2x faster than npm, prevents phantom dependencies, built-in monorepo support with content-addressable storage |
| TypeScript | 5.x | Type checking with project references | Project references enable incremental builds, enforced boundaries, reduced memory (< 1GB vs 3GB) |
| TanStack Router | v1.146+ | Route-based code splitting | Automatic code splitting with file-based routing, type-safe navigation, built for React 19 |
| Vite | 7.x | Build tool and dev server | Best monorepo support, fast HMR with linked packages, pre-bundling optimization |
| mitt | 3.x | Event bus | 200 bytes, TypeScript-first, simple pub/sub for cross-MFE communication |
| Zustand | 5.x | Auth state management | No providers, 4 lines of code for global state, works inside and outside React |
| React Query | 5.90+ | Server state management | De-facto standard for API data fetching, handles 80% of server-state patterns |
| Radix UI | Latest | Accessible UI primitives | WAI-ARIA compliant, unstyled primitives, already in use (Collapsible, Dialog, etc.) |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Tailwind CSS | 4.x | Utility-first styling | Shared design tokens, already configured, v4 has better monorepo support |
| React Hook Form | 7.71+ | Form state management | Complex forms with validation, already in use |
| Zod | 4.x | Schema validation | Runtime type checking for API contracts, already in use |
| Changesets | 2.x | Version management | Publishing shared packages, semantic versioning automation |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| pnpm | npm workspaces | npm is slower, allows phantom dependencies, less disk efficient |
| pnpm | yarn workspaces | yarn PnP breaks many tools, classic mode has phantom dependencies |
| mitt | custom EventTarget | More code to maintain, no TypeScript inference, 200 bytes not worth avoiding |
| TanStack Router | React Router | React Router lacks type-safe routes, manual code splitting, no file-based routing |
| Zustand | Context API | Context causes all consumers to re-render, Zustand has fine-grained subscriptions |

**Installation:**
```bash
# Workspace setup
pnpm add -D -w typescript vite @vitejs/plugin-react

# Router with automatic code splitting
pnpm add @tanstack/react-router @tanstack/router-plugin

# Shared packages
pnpm add @tanstack/react-query mitt zustand zod react-hook-form

# UI primitives (already installed)
# @radix-ui/react-* packages

# Dev tooling
pnpm add -D @changesets/cli
```

## Architecture Patterns

### Recommended Project Structure
```
├── .planning/                    # GSD workflow artifacts (gitignored based on config)
├── pnpm-workspace.yaml           # Workspace configuration
├── package.json                  # Root package with shared devDependencies
├── tsconfig.base.json            # Base TypeScript config (NOT extended by root)
├── tsconfig.json                 # Root references list only
├── eslint.config.js              # Flat config at root (monorepo limitation)
├── packages/
│   ├── ui/                       # Shared component library
│   │   ├── package.json          # "name": "@packages/ui"
│   │   ├── tsconfig.json         # composite: true, references: []
│   │   ├── src/
│   │   │   ├── components/       # Radix-based components
│   │   │   └── index.ts          # Barrel exports
│   │   └── index.ts              # Package entry point
│   ├── api-client/               # React Query setup + interceptors
│   │   ├── package.json          # "name": "@packages/api-client"
│   │   ├── tsconfig.json         # composite: true, references: []
│   │   └── src/
│   │       ├── client.ts         # Base axios/fetch client
│   │       ├── query-client.ts   # QueryClient with defaults
│   │       └── interceptors.ts   # Auth token injection, error handling
│   ├── event-bus/                # Typed mitt wrapper
│   │   ├── package.json          # "name": "@packages/event-bus"
│   │   ├── tsconfig.json         # composite: true, references: []
│   │   └── src/
│   │       ├── events.ts         # Event type definitions
│   │       ├── bus.ts            # mitt instance with types
│   │       └── index.ts          # Exported API
│   └── mfe-types/                # MFE-shell contracts
│       ├── package.json          # "name": "@packages/mfe-types"
│       ├── tsconfig.json         # composite: true, references: []
│       └── src/
│           ├── mfe-config.ts     # MFE registry metadata types
│           ├── auth.ts           # Auth service interfaces
│           └── index.ts          # Barrel exports
└── apps/
    └── shell/                    # Shell application
        ├── package.json          # "name": "@apps/shell"
        ├── tsconfig.json         # composite: true, references packages
        ├── vite.config.ts        # TanStack Router plugin config
        └── src/
            ├── main.tsx          # Entry point
            ├── router.ts         # Router instance
            ├── components/
            │   ├── layout/       # Sidebar, Header, Footer
            │   ├── error-boundary.tsx
            │   └── splash-screen.tsx
            ├── services/
            │   ├── auth.ts       # Auth service implementation
            │   └── mfe-registry.ts
            └── routes/           # TanStack Router file-based routes
                ├── __root.tsx    # Root layout with error boundary
                └── _authenticated/ # Protected routes group
```

### Pattern 1: pnpm Workspace Protocol
**What:** Use `workspace:*` to link local packages, converted to semver on publish
**When to use:** Always for internal package dependencies
**Example:**
```json
{
  "name": "@apps/shell",
  "dependencies": {
    "@packages/ui": "workspace:*",
    "@packages/api-client": "workspace:*",
    "@packages/event-bus": "workspace:*",
    "@packages/mfe-types": "workspace:*"
  }
}
```
**Configuration:**
```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

### Pattern 2: TypeScript Project References
**What:** Each package has `composite: true`, shell references all packages
**When to use:** Always in monorepo for incremental builds and type checking
**Example:**
```json
// packages/ui/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src/**/*"]
}

// apps/shell/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "references": [
    { "path": "../../packages/ui" },
    { "path": "../../packages/api-client" },
    { "path": "../../packages/event-bus" },
    { "path": "../../packages/mfe-types" }
  ],
  "include": ["src/**/*"]
}

// Root tsconfig.json (references only, NOT extended)
{
  "files": [],
  "references": [
    { "path": "./packages/ui" },
    { "path": "./packages/api-client" },
    { "path": "./packages/event-bus" },
    { "path": "./packages/mfe-types" },
    { "path": "./apps/shell" }
  ]
}

// tsconfig.base.json (shared options)
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### Pattern 3: Path Aliases (Scoped by Package)
**What:** Each package has its own path alias scope to avoid conflicts
**When to use:** Always scope aliases with package name or unique prefix
**Example:**
```json
// packages/ui/tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@ui/*": ["./src/*"]
    }
  }
}

// apps/shell/tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```
**Warning:** Never use catch-all aliases like `@/*` in multiple packages - causes ambiguity.

### Pattern 4: TanStack Router Automatic Code Splitting
**What:** Enable `autoCodeSplitting` in Vite plugin to lazy-load routes
**When to use:** Always for MFE pages to minimize initial bundle
**Example:**
```typescript
// apps/shell/vite.config.ts
import { defineConfig } from 'vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      autoCodeSplitting: true,  // Enable automatic code splitting
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts'
    })
  ]
})
```

### Pattern 5: Typed Event Bus with mitt
**What:** Define event types upfront, export typed emitter
**When to use:** Cross-MFE communication without tight coupling
**Example:**
```typescript
// packages/event-bus/src/events.ts
export type MfeEvents = {
  'rent-mfe:completed': { tenantId: string; amount: number };
  'dashboard-mfe:refresh-requested': undefined;
  'auth:login': { userId: string };
  'auth:logout': undefined;
};

// packages/event-bus/src/bus.ts
import mitt from 'mitt';
import type { MfeEvents } from './events';

export const eventBus = mitt<MfeEvents>();

// packages/event-bus/src/index.ts
export { eventBus } from './bus';
export type { MfeEvents } from './events';

// Usage in MFE:
import { eventBus } from '@packages/event-bus';

eventBus.emit('rent-mfe:completed', { tenantId: '123', amount: 5000 });
eventBus.on('dashboard-mfe:refresh-requested', () => {
  // Refresh data
});
```

### Pattern 6: Zustand Auth Store
**What:** Global auth state accessible from any component or vanilla TS
**When to use:** Login state, session management, role checks
**Example:**
```typescript
// apps/shell/src/services/auth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  roles: string[];
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      hasRole: (role) => get().user?.roles.includes(role) ?? false,
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }), // Don't persist computed values
    }
  )
);
```

### Pattern 7: React Query Shared Client
**What:** Configure QueryClient in @packages/api-client with sensible defaults
**When to use:** Consistent data fetching behavior across all MFEs
**Example:**
```typescript
// packages/api-client/src/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

// packages/api-client/src/interceptors.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
});

// Request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-storage'); // Zustand persist key
  if (token) {
    const { state } = JSON.parse(token);
    if (state?.token) {
      config.headers.Authorization = `Bearer ${state.token}`;
    }
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Emit logout event
      import('@packages/event-bus').then(({ eventBus }) => {
        eventBus.emit('auth:logout', undefined);
      });
    }
    return Promise.reject(error);
  }
);
```

### Pattern 8: MFE Registry with Metadata
**What:** Central registry tracking MFE routes, names, versions
**When to use:** Shell needs to know which routes map to which MFEs
**Example:**
```typescript
// packages/mfe-types/src/mfe-config.ts
export interface MfeMetadata {
  name: string;
  routes: string[];
  version: string;
  permissions?: string[];
}

export interface MfeRegistry {
  [mfeId: string]: MfeMetadata;
}

// apps/shell/src/services/mfe-registry.ts
import type { MfeRegistry } from '@packages/mfe-types';

export const mfeRegistry: MfeRegistry = {
  'rent-mfe': {
    name: 'Rent Management',
    routes: ['/rent', '/rent/*'],
    version: '1.0.0',
    permissions: ['rent:view'],
  },
  'dashboard-mfe': {
    name: 'Dashboard',
    routes: ['/dashboard'],
    version: '1.0.0',
  },
};
```

### Pattern 9: Error Boundaries for MFE Isolation
**What:** Wrap each MFE route with error boundary to prevent cascade failures
**When to use:** Always for MFE routes, optional for shell components
**Example:**
```typescript
// apps/shell/src/components/error-boundary.tsx
import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  mfeName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class MfeErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('MFE Error:', this.props.mfeName, error, errorInfo);
    // Could emit event to monitoring service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 border border-red-200 rounded bg-red-50">
          <h3 className="font-semibold text-red-800">
            {this.props.mfeName || 'Component'} failed to load
          </h3>
          <p className="text-sm text-red-600 mt-2">
            {this.state.error?.message || 'Unknown error'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage in route:
// routes/_authenticated.rent.lazy.tsx
import { createLazyFileRoute } from '@tanstack/router-router'
import { MfeErrorBoundary } from '../components/error-boundary'

export const Route = createLazyFileRoute('/_authenticated/rent')({
  component: () => (
    <MfeErrorBoundary mfeName="Rent MFE">
      <RentMfe />
    </MfeErrorBoundary>
  )
})
```

### Pattern 10: Collapsible Sidebar with Radix UI
**What:** Sidebar collapses to icon-only rail, hamburger for mobile
**When to use:** Shell layout component
**Example:**
```typescript
// apps/shell/src/components/layout/sidebar.tsx
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible';
import { Menu, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  return (
    <aside className={cn(
      'transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      <button onClick={() => setCollapsed(!collapsed)}>
        <Menu />
      </button>
      <nav>
        {menuItems.map(item => (
          <Collapsible key={item.id}>
            <CollapsibleTrigger>
              {item.icon}
              {!collapsed && item.label}
              {!collapsed && <ChevronRight />}
            </CollapsibleTrigger>
            <CollapsibleContent>
              {item.children?.map(child => (
                <a key={child.id} href={child.href}>
                  {!collapsed && child.label}
                </a>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </nav>
    </aside>
  );
}
```

### Anti-Patterns to Avoid
- **Global catch-all path aliases** (`@/*` in multiple packages) - causes ambiguity, use scoped aliases
- **Extending root tsconfig.json** - creates circular dependencies, use separate `tsconfig.base.json`
- **Runtime code imports between MFEs** - breaks isolation, use event bus instead
- **Single global error boundary** - doesn't isolate MFE failures, wrap each MFE route
- **Hand-rolling event bus** - mitt is 200 bytes and type-safe, don't reinvent
- **Hoisting all dependencies** - breaks pnpm's strict resolution, use `workspace:*` protocol

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Event bus pub/sub | Custom EventTarget wrapper | mitt | 200 bytes, TypeScript inference, wildcard listeners, memory cleanup |
| Form state management | useReducer + Context | React Hook Form + Zod | Validation, touched state, async validation, field arrays already solved |
| Path alias resolution | Custom Vite plugin | TypeScript paths + Vite resolve.alias | Bundler and IDE support, no maintenance burden |
| Incremental TypeScript builds | Custom build script | TypeScript project references | Built-in, IDE integration, correct invalidation |
| Route-based code splitting | Manual React.lazy | TanStack Router autoCodeSplitting | Automatic chunk generation, preloading, loader splitting |
| Auth state management | Context + reducer | Zustand with persist middleware | Fine-grained subscriptions, no provider tree, vanilla JS access |
| API client with interceptors | Fetch wrapper | axios or ky | Request/response interception, timeout, retry, cancellation |
| Package versioning | Git tags + npm version | Changesets | Semantic versioning, changelog generation, dependency updates |
| Toast notifications | Portal + state | Radix UI Toast or Sonner | Accessibility, hotkeys, swipe gestures, queuing |

**Key insight:** Modern monorepo tooling (pnpm, TypeScript, Vite) has solved the hard problems. Custom solutions add maintenance burden and miss edge cases (like TypeScript's correct cache invalidation or mitt's memory cleanup on `off()`).

## Common Pitfalls

### Pitfall 1: TypeScript Path Aliases Conflict in Monorepo
**What goes wrong:** Multiple packages define the same alias (e.g., `@/`), causing "Module not found" errors or resolving to wrong package.
**Why it happens:** TypeScript doesn't enforce alias uniqueness across project references. Vite/bundler picks first match.
**How to avoid:** Scope aliases by package name (`@ui/*`, `@shell/*`) or use unique prefixes. Never reuse catch-all patterns.
**Warning signs:** Import resolves in IDE but fails at runtime, or wrong module imported.

### Pitfall 2: Forgetting `composite: true` in Referenced Projects
**What goes wrong:** Error: "Referenced project must have setting 'composite': true"
**Why it happens:** TypeScript requires `composite: true` for incremental builds and output tracking.
**How to avoid:** Every package in `references` array MUST have `composite: true`, `declaration: true`, `outDir` set.
**Warning signs:** Build fails immediately with clear error message.

### Pitfall 3: ESLint Flat Config Can't Live in Multiple Packages
**What goes wrong:** ESLint only reads root config in flat config mode, package-specific rules ignored.
**Why it happens:** Flat config limitation - "you basically can't have more than one config file in a monorepo."
**How to avoid:** Keep single `eslint.config.js` at root, use overrides array for package-specific rules.
**Warning signs:** Package-specific lint rules not applying.

### Pitfall 4: Vite Doesn't Pre-Bundle Workspace Dependencies by Default
**What goes wrong:** Slow HMR, frequent page reloads when editing shared packages.
**Why it happens:** Vite treats linked deps as source code, analyzes dependencies instead of bundling.
**How to avoid:** Add workspace packages to `optimizeDeps.include` if they export CommonJS or have many dependencies.
**Warning signs:** "Optimized dependencies changed, reloading" message loops.

### Pitfall 5: React Query Context Not Shared Across Bundles
**What goes wrong:** Each MFE creates separate QueryClient, no cache sharing, duplicate requests.
**Why it happens:** Multiple React bundles = multiple React Query contexts.
**How to avoid:** Export single QueryClient from `@packages/api-client`, import in shell, wrap with QueryClientProvider at root. Don't create new QueryClient in MFEs.
**Warning signs:** Network tab shows duplicate API calls for same data.

### Pitfall 6: MFE Error Boundary at Wrong Level
**What goes wrong:** Error in one MFE crashes entire shell or doesn't catch MFE error at all.
**Why it happens:** Error boundaries only catch errors in children. If boundary is sibling or parent of shell chrome, isolation fails.
**How to avoid:** Wrap error boundary around lazy route component, not around router or root layout.
**Warning signs:** Entire app white-screens on MFE error.

### Pitfall 7: TypeScript Root Config Includes All Files
**What goes wrong:** Extremely slow type checking, high memory usage (3+ GB), IDE hangs.
**Why it happens:** Root tsconfig.json has `include: ["**/*"]` or similar, tries to check all packages at once.
**How to avoid:** Root tsconfig.json should have `"files": []` and only list references. Each package handles its own `include`.
**Warning signs:** `tsc` takes minutes, memory usage climbs steadily.

### Pitfall 8: Forgetting to Configure Bundler Path Aliases
**What goes wrong:** TypeScript compiles but bundler (Vite) throws "Module not found" at runtime.
**Why it happens:** TypeScript `paths` are for type checking only, bundler needs separate `resolve.alias` config.
**How to avoid:** Mirror TypeScript `paths` in `vite.config.ts` `resolve.alias` using same mappings.
**Warning signs:** Build fails or runtime error despite IDE showing no issues.

### Pitfall 9: Event Bus Memory Leaks from Forgotten `off()`
**What goes wrong:** Event handlers accumulate, memory usage grows, handlers fire multiple times.
**Why it happens:** Component registers handler with `on()` but doesn't call `off()` on unmount.
**How to avoid:** Always cleanup in `useEffect` return or component unmount:
```typescript
useEffect(() => {
  const handler = (data) => { /* ... */ };
  eventBus.on('event', handler);
  return () => eventBus.off('event', handler);
}, []);
```
**Warning signs:** Console logs duplicate, app slows over time.

### Pitfall 10: Silent Token Refresh Causes Auth Loop
**What goes wrong:** User sees login screen flashing, infinite redirect loop, or stuck loading state.
**Why it happens:** Refresh logic redirects to login before token check completes, or refresh endpoint also 401s.
**How to avoid:** Use splash screen until initial auth check resolves. Store "intended URL" before redirect. Don't trigger refresh on refresh endpoint failure.
**Warning signs:** Network tab shows repeated auth attempts, user never reaches protected route.

### Pitfall 11: Workspace Protocol Breaks After Publish
**What goes wrong:** Published package has `workspace:*` in dependencies, npm install fails.
**Why it happens:** `workspace:` protocol not converted during `pnpm publish`.
**How to avoid:** Run `pnpm publish` (NOT `npm publish`), which auto-converts `workspace:*` to semver. Verify with `pnpm pack` first.
**Warning signs:** Published package.json shows `workspace:*` in dependencies.

## Code Examples

Verified patterns from official sources:

### pnpm Workspace Configuration
```yaml
# pnpm-workspace.yaml
# Source: https://pnpm.io/workspaces
packages:
  - 'packages/*'
  - 'apps/*'
```

### TypeScript Project Reference Setup
```json
// Source: https://www.typescriptlang.org/docs/handbook/project-references.html
// Package tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

### TanStack Router Auto Code Splitting
```typescript
// Source: https://tanstack.com/router/latest/docs/framework/react/guide/automatic-code-splitting
// vite.config.ts
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      autoCodeSplitting: true,
    }),
  ],
})
```

### mitt Typed Event Bus
```typescript
// Source: https://github.com/developit/mitt
import mitt from 'mitt';

type Events = {
  foo: string;
  bar?: number;
};

const emitter = mitt<Events>();

// TypeScript enforces correct types
emitter.on('foo', (value) => console.log(value)); // value: string
emitter.emit('foo', 'hello'); // ✓
emitter.emit('foo', 42); // ✗ Error: Argument of type 'number' is not assignable
```

### Zustand Auth Store with Persistence
```typescript
// Source: https://github.com/pmndrs/zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth-storage' }
  )
);
```

### Vite Shared Dependency Optimization
```typescript
// Source: https://vite.dev/config/dep-optimization-options
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: ['@packages/ui'], // Force pre-bundle workspace package
  },
  resolve: {
    dedupe: ['react', 'react-dom'], // Deduplicate in monorepo
  },
})
```

### Radix UI Collapsible Sidebar
```typescript
// Source: https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from '@radix-ui/react-collapsible';

function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger>Menu</Collapsible.Trigger>
      <Collapsible.Content>
        {/* Sidebar content */}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
```

### React Error Boundary for MFE Isolation
```typescript
// Source: https://legacy.reactjs.org/docs/error-boundaries.html
class MfeErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('MFE crashed:', this.props.mfeName, error);
  }

  render() {
    if (this.state.hasError) {
      return <div>MFE failed to load</div>;
    }
    return this.props.children;
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| npm workspaces | pnpm workspaces | 2021 | 2x faster installs, prevents phantom dependencies, content-addressable storage |
| Lerna + Yarn | pnpm + Changesets | 2022-2023 | Simpler tooling, faster, better workspace protocol |
| Manual webpack config | Vite with automatic optimization | 2021-2023 | 10x faster dev server, automatic code splitting, native ESM |
| React Router v6 | TanStack Router v1 | 2024 | Type-safe routes, automatic code splitting, file-based routing |
| Redux for all state | React Query + Zustand | 2020-2022 | Less boilerplate, server state separation, fine-grained subscriptions |
| Module Federation (runtime) | Build-time MFE with lazy loading | 2024-2025 | Simpler deployment, better tree-shaking, single Docker image |
| Workspace dep versions | workspace:* protocol | 2021 | Auto-resolve local packages, convert to semver on publish |
| TSConfig extends everywhere | Project references with composite | 2020 | Incremental builds, enforced boundaries, reduced memory |

**Deprecated/outdated:**
- **Lerna**: Bootstrap/hoisting now handled by pnpm workspaces, use Changesets for versioning
- **yarn link / npm link**: Replaced by pnpm workspace protocol for reliable local linking
- **Manual tsconfig paths setup per-package**: Use project references with composite for automatic resolution
- **Separate React Query instance per MFE**: Share single QueryClient from shell to avoid duplicate requests
- **React Router**: TanStack Router supersedes with type-safety and automatic code splitting

## Open Questions

Things that couldn't be fully resolved:

1. **MFE Chunk Loading Progress UI**
   - What we know: TanStack Router supports `<Suspense>` fallback for lazy routes
   - What's unclear: Best pattern for progress bar "across top of page like GitHub" - might need custom Suspense wrapper or router loading state subscription
   - Recommendation: Implement thin progress bar as `<Suspense fallback={<TopProgressBar />}>` wrapper in root route

2. **Deep Link Preservation Implementation**
   - What we know: TanStack Router has `search` and `redirect` capabilities
   - What's unclear: Best place to store intended URL (localStorage vs Zustand) and when to clear it
   - Recommendation: Store in Zustand auth store (`intendedUrl: string | null`), clear after successful navigation

3. **Sidebar Animation Timing (Claude's Discretion)**
   - What we know: Radix Collapsible provides CSS variables for animation, context decision says "Claude's discretion"
   - What's unclear: Exact duration (200ms? 300ms?) and easing function
   - Recommendation: Start with 300ms cubic-bezier(0.4, 0, 0.2, 1) (Tailwind's default), can be adjusted in plan

4. **Breadcrumb Depth and Truncation (Claude's Discretion)**
   - What we know: Context decision says breadcrumbs in header, depth/truncation is discretion
   - What's unclear: Maximum breadcrumb segments before truncation
   - Recommendation: Show max 3 levels with ellipsis for deeper paths, use TanStack Router's route matching for generation

5. **Shell Splash Screen Design (Claude's Discretion)**
   - What we know: Context decision says "branded splash screen until auth check and config fetch"
   - What's unclear: Specific branding elements (logo placement, animation, colors)
   - Recommendation: Simple centered logo with subtle fade-in, defer detailed design to implementation

## Sources

### Primary (HIGH confidence)
- [pnpm Workspaces Documentation](https://pnpm.io/workspaces) - Official workspace configuration
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html) - Official handbook
- [TypeScript Composite Flag](https://www.typescriptlang.org/tsconfig/composite.html) - Official TSConfig reference
- [TanStack Router Code Splitting](https://tanstack.com/router/latest/docs/framework/react/guide/code-splitting) - Official docs
- [mitt GitHub Repository](https://github.com/developit/mitt) - Official TypeScript patterns
- [Zustand GitHub Repository](https://github.com/pmndrs/zustand) - Official documentation
- [Radix UI Collapsible](https://www.radix-ui.com/primitives/docs/components/collapsible) - Official component docs
- [Vite Shared Options](https://vite.dev/config/shared-options) - Official configuration docs
- [React Error Boundaries](https://legacy.reactjs.org/docs/error-boundaries.html) - Official React docs

### Secondary (MEDIUM confidence)
- [Complete Monorepo Guide: pnpm + Workspace + Changesets (2025)](https://jsdev.space/complete-monorepo-guide/) - Comprehensive guide
- [TanStack Router Automatic Code Splitting](https://tanstack.com/router/v1/docs/framework/react/guide/automatic-code-splitting) - Implementation guide
- [Ultimate Guide to TypeScript Monorepos](https://dev.to/mxro/the-ultimate-guide-to-typescript-monorepos-5ap7) - Best practices
- [Managing TypeScript Packages in Monorepos | Nx](https://nx.dev/blog/managing-ts-packages-in-monorepos) - Project references guide
- [State Management in 2026: Redux, Context API, and Modern Patterns](https://www.nucamp.co/blog/state-management-in-2026-redux-context-api-and-modern-patterns) - Current patterns
- [Error Boundaries in Micro-frontend Architecture](https://medium.com/@siddhesh.shirdhankar18/error-boundaries-in-micro-frontend-architecture-5b5dd2c71541) - Isolation patterns
- [Monorepo Configuration | typescript-eslint](https://typescript-eslint.io/troubleshooting/typed-linting/monorepos/) - ESLint setup
- [Ultimate Guide: Frontend Monorepo with Vite, pnpm](https://medium.com/@hibamalhiss/ultimate-guide-how-to-set-up-a-frontend-monorepo-with-vite-pnpm-and-shared-ui-libraries-4081585c069e) - Setup guide

### Tertiary (LOW confidence - WebSearch only)
- Multiple community articles on monorepo setup patterns
- Stack Overflow discussions on TypeScript path alias conflicts
- GitHub discussions on TanStack Router and React Query patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified via official documentation or Context7
- Architecture: HIGH - TypeScript project references, pnpm workspaces official docs
- Pitfalls: MEDIUM-HIGH - Mix of official docs (error boundaries, composite flag) and verified community experiences
- Code examples: HIGH - All sourced from official documentation

**Research date:** 2026-01-22
**Valid until:** 2026-02-22 (30 days - stable ecosystem)
**Re-validation needed if:** TypeScript 5.10+, TanStack Router v2, pnpm v10, React Query v6 released
