# Phase 2: MFE Migration - Research

**Researched:** 2026-01-22
**Domain:** Build-time microfrontend migration with TanStack Router lazy loading and event-based communication
**Confidence:** HIGH

## Summary

Phase 2 migrates 9 page-level features from the monolithic shell to independent MFE packages. The standard approach uses TanStack Router's automatic code splitting (`autoCodeSplitting: true`) which generates separate chunks per route without requiring manual `.lazy.tsx` files. MFEs exist as workspace packages in `apps/` directory, consuming shell services (`@packages/ui`, `@packages/api-client`, `@packages/event-bus`) through pnpm workspace protocol. Cross-MFE communication uses the existing typed event bus with mitt.

The migration is primarily a file extraction exercise: move page code to MFE package, update route file to lazy-load the MFE, verify the chunk appears in `dist/` after build. The infrastructure from Phase 1 (error boundaries, loading bar, event bus, API client) is already in place.

**Primary recommendation:** Create each MFE as a package in `apps/` with its own `package.json` referencing shared packages via `workspace:*`. The shell route files remain in place but import components from MFE packages. TanStack Router's `autoCodeSplitting` handles chunk generation automatically.

## Standard Stack

The established libraries/tools for this domain:

### Core (Already in Place from Phase 1)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TanStack Router | v1.146+ | Automatic code splitting | `autoCodeSplitting: true` generates separate chunks per route |
| pnpm workspaces | 9.x | Package isolation | `workspace:*` protocol links MFEs to shell services |
| mitt | 3.x | Event bus | Already configured in `@packages/event-bus` with typed events |
| React Query | 5.90+ | Server state | Shared `queryClient` from `@packages/api-client` prevents duplicate requests |
| TypeScript | 5.x | Type contracts | Project references verify MFE-shell interfaces at compile time |
| Vite | 7.x | Build optimization | Automatic chunk splitting for lazy routes |

### Supporting (For MFE Development)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| React Hook Form | 7.71+ | Form state | Already used by rent/return forms, move to MFE package |
| Zod | 4.x | Schema validation | Form validation schemas co-located with MFE |
| TanStack Table | 8.21+ | Data tables | Used by reservation-lookup MFE |

### No New Dependencies Needed
| Instead of | Why Not Needed | Use Instead |
|------------|----------------|-------------|
| Module Federation | Build-time approach decided in Phase 1 | TanStack Router auto code splitting |
| Custom lazy loading | TanStack Router handles it | `autoCodeSplitting: true` |
| New event library | mitt already in place | `@packages/event-bus` |
| Runtime MFE loading | Single deployment decision | Workspace packages at build time |

## Architecture Patterns

### Recommended MFE Package Structure
```
apps/
├── shell/                          # Orchestrator (existing)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── _auth.dashboard.tsx  # Import from @apps/mfe-dashboard
│   │   │   ├── _auth.rent.tsx       # Import from @apps/mfe-rent
│   │   │   └── ...
│   │   └── ...
│   └── package.json
├── mfe-dashboard/                  # MFE Package
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts                # Re-exports DashboardPage
│       ├── DashboardPage.tsx       # Extracted from shell
│       └── components/             # Dashboard-specific components
├── mfe-rent/                       # MFE Package
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts                # Re-exports RentPage
│       ├── RentPage.tsx            # Extracted from shell
│       ├── forms/
│       │   ├── RentVehicleForm.tsx
│       │   ├── rent.schema.ts
│       │   └── rent.types.ts
│       └── components/             # Rent-specific components
└── mfe-reservation-lookup/         # MFE Package (complex example)
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── index.ts
        ├── ReservationLookupPage.tsx
        ├── features/
        │   └── rent-vehicle/       # Feature-specific API/queries
        │       ├── api.ts
        │       ├── query.ts
        │       └── mutations.ts
        ├── hooks/
        │   └── useRentVehicleFilters.ts
        ├── components/
        │   ├── SearchComponent.tsx
        │   ├── FiltersComponent.tsx
        │   └── HeaderComponent.tsx
        └── types/
            └── type.ts
```

### Pattern 1: MFE Package Configuration
**What:** Each MFE has its own `package.json` with workspace dependencies
**When to use:** Every MFE package
**Example:**
```json
// apps/mfe-rent/package.json
{
  "name": "@apps/mfe-rent",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./src/index.ts"
    }
  },
  "dependencies": {
    "@packages/ui": "workspace:*",
    "@packages/api-client": "workspace:*",
    "@packages/event-bus": "workspace:*",
    "@packages/mfe-types": "workspace:*"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.71.0",
    "zod": "^4.0.0",
    "@hookform/resolvers": "^5.0.0"
  }
}
```

### Pattern 2: Shell Route Imports MFE
**What:** Route file in shell imports from MFE package, TanStack Router handles code splitting
**When to use:** Every authenticated route
**Example:**
```typescript
// apps/shell/src/routes/_auth.rent.tsx
import { requireRole } from '@/auth/requireRole'
import { MfeErrorBoundary } from '@/components/MfeErrorBoundary'
import { ROLES } from '@/config/roles'
// Import from MFE package - Vite will code-split this automatically
import { RentPage } from '@apps/mfe-rent'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/rent')({
  beforeLoad: () =>
    requireRole([ROLES.SUPER_ADMIN, ROLES.COUNTER_AGENT]),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <MfeErrorBoundary mfeName="Rent">
      <RentPage />
    </MfeErrorBoundary>
  )
}
```

### Pattern 3: MFE Consumes Shell Services
**What:** MFEs use shared packages, not shell internals
**When to use:** Any time MFE needs UI, API, or events
**Example:**
```typescript
// apps/mfe-rent/src/RentPage.tsx
import { Button, Card, CardContent } from '@packages/ui'
import { eventBus } from '@packages/event-bus'
import { http, queryClient, queryKeys } from '@packages/api-client'
import type { Role } from '@packages/mfe-types'

export function RentPage() {
  const handleRentComplete = () => {
    // Emit event for other MFEs to react
    eventBus.emit('data:refresh', { entity: 'rental' })
    eventBus.emit('notification:show', {
      type: 'success',
      message: 'Rental completed successfully'
    })
  }

  return (
    <Card>
      <CardContent>
        {/* MFE content using shared UI */}
      </CardContent>
    </Card>
  )
}
```

### Pattern 4: Event Bus for Cross-MFE Communication
**What:** MFEs communicate through typed events, not direct imports
**When to use:** Rental completion -> dashboard refresh, navigation requests
**Example:**
```typescript
// In mfe-rent after successful rental
import { eventBus } from '@packages/event-bus'

function handleRentSuccess(rentalId: string) {
  // Notify other MFEs about the new rental
  eventBus.emit('data:refresh', {
    entity: 'rental',
    id: rentalId
  })
}

// In mfe-dashboard subscribing to refresh
import { eventBus } from '@packages/event-bus'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

function useDashboardRefresh() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const handler = (event: { entity: string }) => {
      if (event.entity === 'rental') {
        queryClient.invalidateQueries({ queryKey: ['rentals'] })
      }
    }

    eventBus.on('data:refresh', handler)
    return () => eventBus.off('data:refresh', handler)
  }, [queryClient])
}
```

### Pattern 5: TypeScript Project References for MFEs
**What:** Each MFE has `composite: true`, shell references MFE packages
**When to use:** Every MFE package
**Example:**
```json
// apps/mfe-rent/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "baseUrl": ".",
    "paths": {
      "@mfe-rent/*": ["./src/*"]
    }
  },
  "references": [
    { "path": "../../packages/ui" },
    { "path": "../../packages/api-client" },
    { "path": "../../packages/event-bus" },
    { "path": "../../packages/mfe-types" }
  ],
  "include": ["src/**/*"]
}

// apps/shell/tsconfig.json (updated)
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "references": [
    { "path": "../../packages/ui" },
    { "path": "../../packages/api-client" },
    { "path": "../../packages/mfe-types" },
    { "path": "../mfe-dashboard" },
    { "path": "../mfe-rent" },
    { "path": "../mfe-return" },
    { "path": "../mfe-vehicle-exchange" },
    { "path": "../mfe-reservation-lookup" },
    { "path": "../mfe-car-control" },
    { "path": "../mfe-aao" },
    { "path": "../mfe-reports" },
    { "path": "../mfe-settings" }
  ],
  "include": ["src"]
}
```

### Anti-Patterns to Avoid
- **Direct imports between MFEs** - use event bus instead, prevents coupling
- **MFE importing from shell internals** - MFEs only import from `@packages/*`
- **MFE creating its own QueryClient** - use shared `queryClient` from `@packages/api-client`
- **Duplicating UI components in MFE** - move shared components to `@packages/ui`
- **MFE managing its own auth state** - use shell's auth service via event bus
- **Forgetting error boundary on route** - every MFE route wrapped with `MfeErrorBoundary`

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Code splitting | Manual `React.lazy()` | TanStack Router `autoCodeSplitting` | Automatic chunk generation, preloading, route-aware |
| MFE communication | Custom events / window globals | `@packages/event-bus` (mitt) | Type-safe, already configured, memory cleanup |
| Shared UI | Copy components to MFE | `@packages/ui` | Single source of truth, design consistency |
| API layer | Per-MFE fetch/axios | `@packages/api-client` | Shared interceptors, auth token injection |
| MFE error isolation | try/catch in routes | `MfeErrorBoundary` | React error boundaries, retry functionality |
| Loading states | Custom spinners | `MfeLoadingBar` | Consistent UX, already integrated with router |
| Form components | Rebuild form inputs | Move to `@packages/ui` | Reusable across MFEs, consistent validation UX |

**Key insight:** The infrastructure from Phase 1 handles the hard problems (code splitting, error isolation, event bus). Migration is primarily moving files and updating imports.

## Common Pitfalls

### Pitfall 1: MFE Not Getting Code Split
**What goes wrong:** MFE bundle included in shell's main chunk, no separate file in `dist/`
**Why it happens:** Direct import at top of route file with barrel exports
**How to avoid:**
- Verify `autoCodeSplitting: true` in vite.config.ts (already configured)
- After build, check `dist/assets/` for MFE chunk files
- Use Vite build analyzer if chunks seem wrong
**Warning signs:** Initial bundle too large, no separate chunk in dist/

### Pitfall 2: Event Handler Memory Leak
**What goes wrong:** Event handlers accumulate, duplicate notifications, memory growth
**Why it happens:** Forgetting to `off()` in useEffect cleanup
**How to avoid:**
```typescript
useEffect(() => {
  const handler = (data: DataRefreshEvent) => { /* ... */ }
  eventBus.on('data:refresh', handler)
  return () => eventBus.off('data:refresh', handler)  // REQUIRED
}, [])
```
**Warning signs:** Console logs multiply, app slows over time

### Pitfall 3: Circular Package Dependencies
**What goes wrong:** TypeScript errors, build failures, "Module not found"
**Why it happens:** MFE-A imports from MFE-B which imports from MFE-A
**How to avoid:**
- MFEs never import from each other directly
- Cross-MFE communication only via event bus
- Shared types go in `@packages/mfe-types`
**Warning signs:** "Circular dependency detected" warnings, tsc hangs

### Pitfall 4: Duplicate React Instance
**What goes wrong:** Hooks fail, "Invalid hook call", context not shared
**Why it happens:** MFE bundles its own React instead of using shell's
**How to avoid:**
- React/React-DOM as `peerDependencies` in MFE packages
- Vite `resolve.dedupe: ['react', 'react-dom']` (already configured)
**Warning signs:** "Invalid hook call" error, multiple React versions in bundle

### Pitfall 5: Broken Path Aliases After Extraction
**What goes wrong:** MFE can't find `@/components/...` after moving files
**Why it happens:** Shell's `@/*` alias doesn't work in MFE package
**How to avoid:**
- Update imports to use package paths (`@packages/ui`)
- Or define MFE-specific alias (`@mfe-rent/*` -> `./src/*`)
- Never use shell's `@/*` alias in MFE code
**Warning signs:** "Module not found: @/..." in MFE

### Pitfall 6: Role Check Fails in MFE
**What goes wrong:** Unauthorized users see MFE content, or authorized users blocked
**Why it happens:** Role check in route `beforeLoad` not migrated correctly
**How to avoid:**
- Keep `beforeLoad` with `requireRole()` in shell route file
- Shell manages auth, MFE just renders content
- MFE can use `useAuthStore` for conditional UI, not access control
**Warning signs:** Routes accessible without login, wrong role gets access

### Pitfall 7: React Query Cache Not Shared
**What goes wrong:** Duplicate API requests, stale data, inconsistent state
**Why it happens:** MFE creates its own QueryClient or QueryClientProvider
**How to avoid:**
- Import `queryClient` from `@packages/api-client`
- Shell provides single `QueryClientProvider` at root
- MFEs just use `useQuery` hooks, no provider needed
**Warning signs:** Network tab shows duplicate requests for same endpoint

### Pitfall 8: MFE Styles Conflict
**What goes wrong:** CSS classes clash, wrong styles applied, Tailwind purges MFE classes
**Why it happens:** Tailwind not configured to scan MFE packages
**How to avoid:**
- Update Tailwind config to include `apps/mfe-*/src/**/*.{ts,tsx}`
- Or ensure MFE uses only `@packages/ui` components (already scanned)
**Warning signs:** Missing Tailwind classes, broken layouts in MFE

### Pitfall 9: Form State Lost on Navigation
**What goes wrong:** User fills form, navigates away, comes back to empty form
**Why it happens:** Component unmounts, state lost
**How to avoid:**
- Not a migration issue - same behavior as before
- If needed, persist form state to sessionStorage
- React Hook Form persists validation state, not input values
**Warning signs:** User complaints about lost work (existing behavior)

## Code Examples

Verified patterns for migration:

### MFE Package Entry Point
```typescript
// apps/mfe-rent/src/index.ts
export { RentPage } from './RentPage'
export type { RentVehicleFormValues } from './forms/rent.types'
```

### Shell Route Importing MFE
```typescript
// apps/shell/src/routes/_auth.rent.tsx
import { requireRole } from '@/auth/requireRole'
import { MfeErrorBoundary } from '@/components/MfeErrorBoundary'
import { ROLES } from '@/config/roles'
import { RentPage } from '@apps/mfe-rent'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/rent')({
  beforeLoad: () =>
    requireRole([ROLES.SUPER_ADMIN, ROLES.COUNTER_AGENT]),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <MfeErrorBoundary mfeName="Rent">
      <RentPage />
    </MfeErrorBoundary>
  )
}
```

### MFE Using Shared Services
```typescript
// apps/mfe-rent/src/RentPage.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@packages/ui'
import { eventBus } from '@packages/event-bus'
import { Car } from 'lucide-react'
import RentVehicleForm from './forms/RentVehicleForm'

export function RentPage() {
  const handleRentComplete = (data: unknown) => {
    // Notify other MFEs
    eventBus.emit('data:refresh', { entity: 'rental' })
    eventBus.emit('notification:show', {
      type: 'success',
      message: 'Vehicle rented successfully'
    })
  }

  return (
    <div className="w-full h-full flex items-center justify-center px-4 py-6">
      {/* Same layout as original */}
    </div>
  )
}
```

### Vite Configuration Verification
```typescript
// apps/shell/vite.config.ts (verify this exists)
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import routerPlugin from "@tanstack/router-plugin/vite"
import path from "path"

export default defineConfig({
  plugins: [
    routerPlugin({
      autoCodeSplitting: true,  // KEY: This enables automatic code splitting
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Add MFE package aliases if needed
    },
    dedupe: ['react', 'react-dom'],  // Prevent duplicate React
  },
})
```

### Build Output Verification
```bash
# After migration, verify chunks exist
ls -la dist/assets/

# Expected output (example):
# _auth.rent-[hash].js      # MFE-rent chunk
# _auth.return-[hash].js    # MFE-return chunk
# _auth.dashboard-[hash].js # MFE-dashboard chunk
# index-[hash].js           # Main shell bundle
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual React.lazy() | TanStack Router autoCodeSplitting | 2024 | Zero-config code splitting |
| Module Federation (runtime) | Build-time MFE with lazy routes | 2024-2025 | Simpler deployment, better tree-shaking |
| Lerna for monorepo | pnpm workspaces + Turborepo | 2022-2023 | Faster, simpler workspace linking |
| MFE as separate builds | MFE as workspace packages | 2024 | Single Docker image, shared deps |
| Custom event emitter | mitt with TypeScript | 2021+ | 200 bytes, type inference, cleanup |

**Deprecated/outdated:**
- **Module Federation for build-time MFE**: Only needed for runtime loading from different origins
- **Separate MFE deployments**: Build-time approach means single deployment
- **MFE version management**: All MFEs version together in monorepo

## Migration Order

Based on dependency analysis of existing code:

### Tier 1: Simple MFEs (No External Dependencies)
These pages have minimal dependencies, good for establishing the pattern:

| MFE | Complexity | Dependencies | Notes |
|-----|------------|--------------|-------|
| mfe-aao | Low | None | Placeholder page, 7 lines |
| mfe-car-control | Low | None | Placeholder page, 7 lines |
| mfe-reports | Low | None | Placeholder page, 7 lines |
| mfe-settings | Low | None | Placeholder page, 7 lines |
| mfe-vehicle-exchange | Low | None | Placeholder page, 9 lines |

### Tier 2: Medium Complexity
These have forms and local state:

| MFE | Complexity | Dependencies | Notes |
|-----|------------|--------------|-------|
| mfe-dashboard | Medium | lucide-react, Card components | Quick actions navigation |
| mfe-return | Medium | Form components, Card, schema | ReturnVehicleForm |
| mfe-rent | Medium | Form components, schema, types | RentVehicleForm |

### Tier 3: High Complexity
These have API calls, tables, and more dependencies:

| MFE | Complexity | Dependencies | Notes |
|-----|------------|--------------|-------|
| mfe-reservation-lookup | High | DataTable, queries, hooks, filters, API | Most complex page |

**Recommended Order:**
1. Start with one Tier 1 MFE (mfe-settings) to establish the pattern
2. Do all Tier 1 MFEs to validate approach
3. Move to mfe-dashboard (familiar components)
4. Do mfe-rent and mfe-return together (similar form patterns)
5. End with mfe-reservation-lookup (most complex, benefits from lessons learned)

## Existing Events to Define

Based on code analysis, these cross-MFE events are needed:

| Event | Trigger | Subscribers | Payload |
|-------|---------|-------------|---------|
| `data:refresh` | After rent/return/exchange complete | Dashboard, Reservation Lookup | `{ entity: 'rental' \| 'return' \| 'vehicle', id?: string }` |
| `navigation:change` | Dashboard quick action click | Shell router | `{ path: string, state?: Record<string, unknown> }` |
| `notification:show` | Form success/error | Shell notification system | `{ type, message, duration? }` |
| `auth:state-changed` | Login/logout | All MFEs | `{ isAuthenticated, user? }` |

These events are already defined in `@packages/event-bus/src/events.ts`.

## Shared Components to Extract

Components currently in shell that multiple MFEs will need:

| Component | Current Location | Move To | Used By |
|-----------|------------------|---------|---------|
| FormProvider | `shell/components/form/` | `@packages/ui` | mfe-rent, mfe-return |
| FormInput | `shell/components/form/` | `@packages/ui` | mfe-rent, mfe-return |
| FormSelect | `shell/components/form/` | `@packages/ui` | mfe-rent |
| FormError | `shell/components/form/` | `@packages/ui` | mfe-rent, mfe-return |
| DataTable | `shell/components/ui/table/` | `@packages/ui` | mfe-reservation-lookup |

**Note:** These should be extracted to `@packages/ui` before or during migration to avoid duplication.

## Open Questions

Things that couldn't be fully resolved:

1. **MFE-Specific Styling Beyond Tailwind**
   - What we know: Tailwind handles most styling via `@packages/ui`
   - What's unclear: If MFE needs custom CSS, where does it go?
   - Recommendation: Co-locate with MFE in `src/styles/`, Vite will bundle it

2. **Testing MFEs in Isolation**
   - What we know: Vitest can test components, React Testing Library works
   - What's unclear: How to test MFE without shell context
   - Recommendation: Mock shell services in tests, add `vitest.config.ts` per MFE

3. **MFE-Level Environment Variables**
   - What we know: Vite exposes `VITE_*` env vars at build time
   - What's unclear: Can MFEs have their own env vars?
   - Recommendation: All env vars in shell, pass to MFEs via props or context if needed

4. **Hot Reload for MFE Packages**
   - What we know: Vite HMR works for shell source code
   - What's unclear: Does HMR work for changes in MFE packages?
   - Recommendation: Test after first MFE migration, may need `optimizeDeps.include`

## Sources

### Primary (HIGH confidence)
- [TanStack Router Code Splitting](https://tanstack.com/router/v1/docs/framework/react/guide/code-splitting) - Official documentation
- [TanStack Router Automatic Code Splitting](https://tanstack.com/router/v1/docs/framework/react/guide/automatic-code-splitting) - Official documentation
- [createLazyFileRoute API](https://tanstack.com/router/latest/docs/framework/react/api/router/createLazyFileRouteFunction) - Official API reference
- [pnpm Workspaces](https://pnpm.io/workspaces) - Official documentation
- [mitt GitHub](https://github.com/developit/mitt) - Event bus library
- Codebase analysis of existing shell, packages, and Phase 1 infrastructure

### Secondary (MEDIUM confidence)
- [Complete Monorepo Guide 2025](https://jsdev.space/complete-monorepo-guide/) - Community patterns
- [Cross-MFE Communication Patterns](https://dev.to/luistak/cross-micro-frontends-communication-30m3) - Communication approaches
- [Monorepo Architecture 2025](https://feature-sliced.design/blog/frontend-monorepo-explained) - Architecture patterns
- [File Routes and Lazy Loading](https://deepwiki.com/tanstack/router/3.4-file-routes-and-lazy-loading) - TanStack Router patterns

### Tertiary (LOW confidence)
- WebSearch results for build-time MFE patterns (verified against official docs)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Using existing Phase 1 infrastructure, verified via codebase
- Architecture patterns: HIGH - Based on TanStack Router official docs and existing code
- Migration order: MEDIUM - Based on dependency analysis, may need adjustment
- Pitfalls: HIGH - Common issues documented in official sources and community

**Research date:** 2026-01-22
**Valid until:** 2026-02-22 (30 days - stable ecosystem)
**Re-validation needed if:** TanStack Router major version change, pnpm workspace changes
