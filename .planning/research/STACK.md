# Technology Stack: Build-Time Microfrontend Architecture

**Project:** Car Rental Dashboard - Build-Time MFE
**Researched:** 2026-01-22
**Architecture:** Build-time composition, single deploy artifact, route-based lazy loading
**Overall Confidence:** HIGH

---

## Executive Summary

For build-time microfrontend architecture with React 19 + Vite 7, **avoid runtime Module Federation entirely**. Your requirement for "single deploy artifact" means you want **build-time composition with route-based lazy loading**, NOT runtime module federation.

**Key insight:** The 2025 ecosystem heavily promotes Module Federation for MFE, but that's **runtime composition** with independent deployments. Your architecture is fundamentally different - you want monorepo build-time composition where all MFEs compile into a single bundle with strategic code splitting.

**Recommended approach:**
- pnpm workspaces for monorepo structure (already in place)
- TanStack Router's native lazy loading (already using)
- Shared TypeScript packages with Zod for contracts
- Simple event emitter (mitt) for cross-MFE communication
- vite-tsconfig-paths for clean import paths

**DO NOT USE:** Module Federation plugins (@originjs/vite-plugin-federation, @module-federation/vite) - these are for runtime composition, not your use case.

---

## Core Monorepo Infrastructure

### Package Manager: pnpm (v9.x+)

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **pnpm** | 9.x+ | Monorepo package manager with workspaces | HIGH |

**Why pnpm:**
- Already have monorepo structure (apps/, packages/)
- Fast, efficient disk space usage with symlinks
- Workspace protocol enables real-time package updates without publishing
- Standard for Vite monorepos in 2025
- Better than npm workspaces (speed) or Yarn (compatibility)

**Configuration:**
```yaml
# pnpm-workspace.yaml (create at root)
packages:
  - 'apps/*'
  - 'packages/*'
```

**Sources:**
- [pnpm Workspaces Official Documentation](https://pnpm.io/workspaces)
- [React Monorepo Setup with pnpm and Vite](https://dev.to/lico/react-monorepo-setup-tutorial-with-pnpm-and-vite-react-project-ui-utils-5705)

---

## Monorepo Orchestration: None Required

**Decision:** Do NOT add Nx, Turborepo, or Lerna.

**Rationale:**
Your project is small-scale (9 MFEs + 1 shell). Task runners add complexity you don't need yet:
- **Nx:** Over-engineered for <10 packages. Better for 50+ packages with complex dependency graphs.
- **Turborepo:** Optimizes build caching, but with 10 packages builds are already fast.
- **Lerna:** Deprecated/maintenance mode. Use pnpm workspaces instead.

**When to revisit:** If build times exceed 60 seconds or team grows beyond 15 developers.

**Confidence:** HIGH

**Sources:**
- [Monorepo Insights: Nx, Turborepo, and PNPM](https://medium.com/ekino-france/monorepo-insights-nx-turborepo-and-pnpm-3-4-751384b5a6db)
- [Top 5 Monorepo Tools for 2025](https://www.aviator.co/blog/monorepo-tools/)

---

## Build Tool: Vite 7 (Already Using)

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **Vite** | 7.2.4 (current) | Fast dev server, production bundler | HIGH |
| **@vitejs/plugin-react** | 5.1.1 (current) | React Fast Refresh + JSX transform | HIGH |
| **vite-tsconfig-paths** | 6.x | TypeScript path mapping support | MEDIUM |

**Why Vite:**
- Already using Vite 7 (verified in package.json)
- Native ESM dev server with instant HMR
- Rollup-based production builds with excellent code splitting
- TanStack Router's lazy loading leverages Vite's dynamic imports perfectly

**New addition: vite-tsconfig-paths**

**Why add it:**
- Clean imports: `import { Button } from '@shared/ui'` instead of `'../../../packages/shared-ui'`
- Monorepo-aware: discovers tsconfig.json files across workspace
- Performance: Lazy discovery mode avoids parsing irrelevant tsconfigs

**Installation:**
```bash
pnpm add -D vite-tsconfig-paths
```

**Configuration:**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths({
      root: '../../', // Point to monorepo root
      projects: ['apps/*', 'packages/*'], // Discover all workspace packages
    }),
  ],
})
```

**DO NOT USE:** Module Federation plugins. These are for runtime composition with independent deployments. You're building a single artifact with route-based lazy loading.

**Confidence:** HIGH for Vite, MEDIUM for vite-tsconfig-paths (needs verification in your setup)

**Sources:**
- [vite-tsconfig-paths npm package](https://www.npmjs.com/package/vite-tsconfig-paths)
- [vite-tsconfig-paths GitHub](https://github.com/aleclarson/vite-tsconfig-paths)

---

## Route-Based Lazy Loading: TanStack Router (Already Using)

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **@tanstack/react-router** | 1.146.2 (current) | Type-safe routing with code splitting | HIGH |
| **@tanstack/router-plugin** | 1.147.3 (current) | File-based routing with .lazy.tsx | HIGH |

**Why TanStack Router:**
- Already using it
- Native lazy loading via `.lazy.tsx` files (perfect for MFE boundaries)
- Type-safe across entire application
- Automatic code splitting at route boundaries
- No additional libraries needed for code splitting

**How it maps to MFE architecture:**

Each MFE becomes a route subtree:
```
routes/
  rentals/               # MFE: Rentals
    index.lazy.tsx
    new.lazy.tsx
  returns/               # MFE: Returns
    index.lazy.tsx
  aao/                   # MFE: AAO
    index.lazy.tsx
```

**Lazy loading pattern:**
```typescript
// routes/rentals/index.lazy.tsx
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/rentals/')({
  component: RentalsIndex,
})

function RentalsIndex() {
  // MFE component code
}
```

**Benefits:**
- Each `.lazy.tsx` becomes a separate chunk automatically
- Shell loads instantly, MFE code loads on navigation
- No runtime federation complexity
- Works perfectly with single build artifact

**Confidence:** HIGH (already using, just needs organization)

**Sources:**
- [TanStack Router Code Splitting Documentation](https://tanstack.com/router/latest/docs/framework/react/guide/code-splitting)
- [TanStack Router Automatic Code Splitting](https://tanstack.com/router/v1/docs/framework/react/guide/automatic-code-splitting)

---

## Shared Type Contracts: Zod (Already Using)

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **zod** | 4.3.5 (current) | Runtime validation + type inference | HIGH |

**Why Zod:**
- Already using Zod 4.3.5
- Single source of truth for types AND validation
- Runtime validation ensures MFEs receive correct data
- TypeScript inference with `z.infer<typeof schema>`
- Perfect for shared contracts in monorepo

**Architecture pattern:**
```
packages/mfe-types/
  src/
    rentals/
      rental.schema.ts      # Zod schema
      rental.types.ts       # z.infer<typeof schema>
    events/
      event.schema.ts       # Event bus message schemas
```

**Example:**
```typescript
// packages/mfe-types/src/rentals/rental.schema.ts
import { z } from 'zod'

export const RentalSchema = z.object({
  id: z.string(),
  vehicle: z.object({
    make: z.string(),
    model: z.string(),
  }),
  customer: z.object({
    name: z.string(),
    email: z.string().email(),
  }),
  startDate: z.date(),
  endDate: z.date(),
})

export type Rental = z.infer<typeof RentalSchema>
```

**Usage in MFEs:**
```typescript
// apps/shell or any MFE
import { RentalSchema, type Rental } from '@mfe-types/rentals'

// Validate data from API
const rental = RentalSchema.parse(apiResponse)

// Type-safe throughout
function processRental(rental: Rental) {
  // TypeScript knows the shape
}
```

**Benefits:**
- All MFEs import from `@mfe-types` package
- Changes to schemas propagate via pnpm workspace protocol
- Runtime validation catches contract violations
- No need for separate .d.ts files - Zod handles both

**Confidence:** HIGH

**Sources:**
- [End-to-end Typesafe APIs with TypeScript and shared Zod schemas](https://dev.to/jussinevavuori/end-to-end-typesafe-apis-with-typescript-and-shared-zod-schemas-4jmo)
- [Using Zod with TypeScript: A Guide for Frontend Developers](https://codeparrot.ai/blogs/using-zod-with-typescript-a-guide-for-frontend-developers)

---

## Cross-MFE Communication: mitt (Event Bus)

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **mitt** | 3.0.1 | Tiny event emitter for cross-MFE events | HIGH |

**Why mitt:**
- **Tiny:** 200 bytes minified + gzipped
- **Type-safe:** TypeScript support out of the box
- **Simple:** Just emit/on/off - no complexity
- **Framework-agnostic:** Works anywhere JavaScript runs
- **Standard in 2025:** Recommended for React microfrontends

**Installation:**
```bash
pnpm add mitt
```

**Architecture:**
```
packages/shared-state/
  src/
    event-bus.ts          # Singleton mitt instance
    event-types.ts        # TypeScript event definitions
```

**Implementation:**
```typescript
// packages/shared-state/src/event-types.ts
import type { Rental } from '@mfe-types/rentals'

export type AppEvents = {
  'rental:created': Rental
  'rental:updated': Rental
  'rental:deleted': { id: string }
  'user:authenticated': { userId: string }
}

// packages/shared-state/src/event-bus.ts
import mitt from 'mitt'
import type { AppEvents } from './event-types'

export const eventBus = mitt<AppEvents>()
```

**Usage in MFEs:**
```typescript
// MFE: Rentals (emits event)
import { eventBus } from '@shared/state'

function createRental(rental: Rental) {
  // Save rental...
  eventBus.emit('rental:created', rental)
}

// MFE: Dashboard (listens for event)
import { eventBus } from '@shared/state'
import { useEffect } from 'react'

function Dashboard() {
  useEffect(() => {
    const handler = (rental: Rental) => {
      // Update dashboard stats
    }

    eventBus.on('rental:created', handler)
    return () => eventBus.off('rental:created', handler)
  }, [])
}
```

**Why NOT Zustand for cross-MFE:**
- Zustand is great for shared state WITHIN an MFE
- For ACROSS MFEs, event bus is better (loose coupling)
- Events allow MFEs to remain independent
- You're already using Zustand 5.0.9 - keep it for local state

**Alternative considered: BroadcastChannel**
- Native browser API, zero bytes
- But: doesn't work if you later add SSR
- mitt is universal and barely adds weight

**Confidence:** HIGH

**Sources:**
- [mitt GitHub Repository](https://github.com/developit/mitt)
- [Using the mitt Package for Event Handling in React](https://medium.com/@jnikhil652/using-the-mitt-package-for-event-handling-in-react-02ca8da46a2e)
- [Mitt Guide: Tiny 200b functional Event Emitter](https://generalistprogrammer.com/tutorials/mitt-npm-package-guide)

---

## Shared State Management: Zustand (Already Using)

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **zustand** | 5.0.9 (current) | Local state management within MFEs | HIGH |

**Why Zustand:**
- Already using it
- Lightweight, simple API
- Perfect for state WITHIN an MFE
- NOT for cross-MFE communication (use mitt for that)

**Architecture pattern:**
```typescript
// Each MFE has its own store
packages/mfe-rentals/src/store.ts
packages/mfe-returns/src/store.ts
packages/mfe-aao/src/store.ts

// Shared state (user auth, etc.) goes in packages/shared-state
packages/shared-state/src/auth-store.ts
```

**Confidence:** HIGH

---

## TypeScript Configuration

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **TypeScript** | 5.9.3 (current) | Type safety across monorepo | HIGH |

**Monorepo tsconfig pattern:**

```
tsconfig.json (root)
  ↓
tsconfig.base.json (shared config)
  ↓
apps/shell/tsconfig.json (extends base)
packages/mfe-types/tsconfig.json (extends base)
packages/shared-ui/tsconfig.json (extends base)
```

**tsconfig.base.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    "paths": {
      "@shared/ui": ["./packages/shared-ui/src"],
      "@shared/utils": ["./packages/shared-utils/src"],
      "@shared/state": ["./packages/shared-state/src"],
      "@mfe-types/*": ["./packages/mfe-types/src/*"]
    }
  }
}
```

**Confidence:** HIGH

---

## Testing Infrastructure (Already in Place)

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **vitest** | 4.0.16 (current) | Unit/integration testing | HIGH |
| **@testing-library/react** | 16.3.1 (current) | React component testing | HIGH |
| **@playwright/test** | 1.51.1 (current) | E2E testing | HIGH |

**No changes needed:** Your testing stack is already excellent and works with monorepo structure.

**Confidence:** HIGH

---

## Build-Time vs Runtime: Why This Stack?

### What You're Building (Build-Time Composition)

```
Single artifact deployment:
- All MFEs built together
- Single npm run build
- One bundle with code-split chunks
- Deploy to single CDN/server
```

**Build process:**
```bash
# At monorepo root
pnpm build

# Results in:
dist/
  index.html
  assets/
    shell-abc123.js
    rentals-def456.js    # Lazy-loaded chunk
    returns-ghi789.js    # Lazy-loaded chunk
    aao-jkl012.js        # Lazy-loaded chunk
    shared-mno345.js     # Shared dependencies
```

### What Module Federation Does (Runtime Composition)

```
Independent deployments:
- Each MFE built separately
- Independent CI/CD pipelines
- Different domains/subdomains
- Runtime discovery and loading
```

**Not your requirement.**

### Why Build-Time is Right for You

From research, build-time integration has clear advantages for your use case:

**Advantages:**
- Simpler setup (no federation complexity)
- Better initial load performance (optimized bundling)
- Easier dependency management (single package.json)
- Predictable runtime behavior (no version drift)
- Smaller total bundle size (shared dependencies deduped)

**Tradeoffs:**
- Cannot deploy MFEs independently (not your requirement)
- Rebuild shell when MFE changes (acceptable for single team)

**Confidence:** HIGH

**Sources:**
- [Micro Frontend: Run-Time Vs. Build-Time Integration](https://www.syncfusion.com/blogs/post/micro-frontend-run-time-vs-build-time)
- [Micro Frontends: Build-Time vs. Runtime Integration](https://blog.bitsrc.io/micro-frontends-build-time-vs-runtime-integration-9bc771a1a42a)

---

## What NOT to Use

### ❌ Module Federation Plugins

**DO NOT ADD:**
- `@originjs/vite-plugin-federation` (v1.4.1)
- `@module-federation/vite` (v1.9.4)

**Why not:**
These are for **runtime composition** where MFEs are deployed independently and loaded at runtime. You want **build-time composition** with a single deploy artifact.

**Confusion in ecosystem:** The 2025 MFE ecosystem heavily promotes Module Federation, but that's for a different architecture pattern. Don't let popular !== right for your use case.

**Confidence:** HIGH

### ❌ Nx or Turborepo

**Not needed yet.** Your project is too small (10 packages). These tools shine at 50+ packages or 20+ developers.

**Reconsider when:** Build times exceed 60 seconds.

**Confidence:** MEDIUM (might need sooner if team grows fast)

### ❌ Single-SPA

**Why not:** Single-SPA is for runtime composition with framework-agnostic MFEs. You're using React everywhere with TanStack Router.

**Confidence:** HIGH

---

## Installation Checklist

### New Dependencies

```bash
# At monorepo root
pnpm add -D vite-tsconfig-paths

# Event bus for cross-MFE communication
pnpm add mitt

# Create pnpm-workspace.yaml if not exists
cat > pnpm-workspace.yaml << EOF
packages:
  - 'apps/*'
  - 'packages/*'
EOF
```

### Update package.json (workspace packages)

```json
// packages/shared-ui/package.json
{
  "name": "@shared/ui",
  "version": "0.0.0",
  "exports": {
    ".": "./src/index.ts"
  }
}

// apps/shell/package.json (reference workspace packages)
{
  "dependencies": {
    "@shared/ui": "workspace:*",
    "@shared/utils": "workspace:*",
    "@shared/state": "workspace:*",
    "@mfe-types/rentals": "workspace:*"
  }
}
```

### Scripts to Add

```json
// Root package.json
{
  "scripts": {
    "dev": "pnpm --filter shell dev",
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "lint": "pnpm -r lint"
  }
}
```

---

## Confidence Assessment

| Area | Confidence | Rationale |
|------|------------|-----------|
| **Core stack (React/Vite/TS)** | HIGH | Already using, verified versions current |
| **Monorepo (pnpm workspaces)** | HIGH | Standard for Vite monorepos, well-documented |
| **Lazy loading (TanStack Router)** | HIGH | Native feature, already using router |
| **Type contracts (Zod)** | HIGH | Already using, standard for shared types |
| **Event bus (mitt)** | HIGH | Industry standard, 200 bytes, widely used |
| **Path mapping (vite-tsconfig-paths)** | MEDIUM | Well-documented but needs testing in your setup |
| **NOT using Module Federation** | HIGH | Verified wrong pattern for build-time composition |

---

## Open Questions for Roadmap

1. **Multi-MFE development:** How to run multiple MFEs simultaneously in dev mode?
   - Answer: Likely just `pnpm --filter shell dev` since shell imports all MFEs

2. **Build optimization:** Should MFEs share more chunks beyond React/ReactDOM?
   - Research in Phase 2: Vite's `manualChunks` configuration

3. **Type checking:** Should types be checked at root or per-package?
   - Recommendation: Root-level `tsc --build` for monorepo

---

## Version Currency Check

All versions verified as of 2026-01-22:

- React 19.2.0 ✅ (latest)
- Vite 7.2.4 ✅ (latest)
- TypeScript 5.9.3 ✅ (stable, 5.10+ in beta)
- TanStack Router 1.146.2 ✅ (actively maintained)
- Zustand 5.0.9 ✅ (latest stable)
- Zod 4.3.5 ✅ (latest)
- mitt 3.0.1 ✅ (latest)
- vite-tsconfig-paths 6.x ✅ (latest)

---

## Summary: The Stack

```
BUILD TOOL:           Vite 7
FRAMEWORK:            React 19
ROUTER:               TanStack Router (lazy loading built-in)
STATE (LOCAL):        Zustand 5
STATE (CROSS-MFE):    mitt event bus
TYPE CONTRACTS:       Zod 4 + TypeScript 5.9
MONOREPO:             pnpm workspaces
PATH MAPPING:         vite-tsconfig-paths
TESTING:              Vitest + Testing Library + Playwright (already in place)

NOT USING:            Module Federation (wrong pattern)
NOT USING:            Nx/Turborepo (too small)
NOT USING:            Single-SPA (runtime composition)
```

**Total new dependencies:** 2 (vite-tsconfig-paths, mitt)
**Total removals:** 0 (no breaking changes)
**Architecture pattern:** Build-time composition with route-based lazy loading

This stack leverages your existing tools, adds minimal complexity, and correctly implements build-time MFE architecture without the runtime federation pattern that dominates 2025 search results but doesn't match your requirements.

---

## Sources Summary

**High Confidence (Context7/Official Docs):**
- TanStack Router: [Code Splitting Documentation](https://tanstack.com/router/latest/docs/framework/react/guide/code-splitting)
- pnpm Workspaces: [Official Documentation](https://pnpm.io/workspaces)
- vite-tsconfig-paths: [GitHub Repository](https://github.com/aleclarson/vite-tsconfig-paths)
- mitt: [GitHub Repository](https://github.com/developit/mitt)
- Zod: [Official Documentation](https://zod.dev/)

**Medium Confidence (WebSearch verified with official sources):**
- Module Federation plugins: [originjs GitHub](https://github.com/originjs/vite-plugin-federation), [module-federation.io](https://module-federation.io/guide/basic/vite)
- Build-time vs Runtime: [Syncfusion Article](https://www.syncfusion.com/blogs/post/micro-frontend-run-time-vs-build-time), [Bits and Pieces](https://blog.bitsrc.io/micro-frontends-build-time-vs-runtime-integration-9bc771a1a42a)

**Current as of:** 2026-01-22
