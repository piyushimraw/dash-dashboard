# Feature: Migrate to Micro-Frontend Architecture with Build-Time Bundling

The following plan should be complete, but it's important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils, types, and models. Import from the right files, etc.

## Feature Description

Transform the current monolithic DASH Portal SPA into a micro-frontend architecture where each business vertical (rentals, returns, fleet-management, etc.) is developed, built, and packaged as an independent module, then bundled at build-time into a unified application shell. The architecture uses a monorepo structure to enable code sharing while maintaining team autonomy.

**Key Approach: Build-Time Composition**
- Micro-frontends are npm packages within a monorepo
- Shell application imports and bundles all micro-frontends at build time
- Single deployment artifact (no runtime module loading)
- Shared dependencies deduplicated during build

## User Story

As a **development team lead**,
I want to **split the monolithic application into domain-specific micro-frontends within a monorepo**,
So that **teams can work independently on business verticals while sharing common infrastructure and deploying as a single optimized bundle**.

## Problem Statement

The current monolithic architecture has several challenges:
1. **Tight coupling**: Sidebar navigation hardcodes 30+ menu items across all features
2. **Single deployment unit**: Any change requires rebuilding and deploying the entire application
3. **Scaling teams**: Multiple teams working on different features leads to merge conflicts and coordination overhead
4. **Feature ownership**: No clear boundaries between business verticals (rentals, returns, fleet-management)
5. **Testing complexity**: Cannot test features in isolation

## Solution Statement

Implement a **build-time micro-frontend architecture** using:
1. **pnpm workspaces** for monorepo package management
2. **Turborepo** for build orchestration and caching
3. **Vite library mode** for building micro-frontend packages
4. **Shell application** that imports and composes all micro-frontends
5. **Shared packages** for UI components, utilities, and configurations
6. **Dynamic navigation** that micro-frontends register into

This approach provides team autonomy while maintaining the performance benefits of a single-bundle deployment.

## Feature Metadata

**Feature Type**: Refactor (Architecture Migration)
**Estimated Complexity**: High
**Primary Systems Affected**: Build system, routing, navigation, state management, all feature modules
**Dependencies**: pnpm 9.x, Turborepo, Vite 7.x

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

| File | Lines | Why |
|------|-------|-----|
| `src/main.tsx` | 1-37 | Entry point, router setup, QueryClient provider - becomes shell entry |
| `src/router.ts` | 1-21 | Router creation pattern - needs refactor for MFE route registration |
| `src/routes/_auth.tsx` | 1-237 | Auth layout - becomes shell layout |
| `src/components/Sidebar.tsx` | 40-156 | Hardcoded menu items - needs dynamic registration |
| `src/features/rent-vehicle/` | All | Feature module pattern to replicate for all MFEs |
| `src/components/ui/` | All | Shared UI components - extract to shared package |
| `src/components/dialogs/global-dialog.tsx` | 1-71 | Dialog system - needs plugin-based registration |
| `src/components/dialogs/useGlobalDialogStore.ts` | 1-37 | Dialog registry - needs dynamic extension |
| `src/store/useAuthStore.ts` | All | Auth state - moves to shared package |
| `src/lib/api/http.ts` | All | HTTP client - moves to shared package |
| `src/lib/react-query/queryClient.ts` | All | Query client config - moves to shared package |
| `vite.config.ts` | All | Build config - needs split for MFE builds |
| `package.json` | All | Dependencies - needs workspace restructure |
| `tsconfig.json` | All | TypeScript config - needs project references |

### New Files/Directories to Create

**Monorepo Root:**
```
├── pnpm-workspace.yaml          # Workspace definition
├── turbo.json                   # Turborepo configuration
├── package.json                 # Root package.json (workspaces)
├── tsconfig.base.json           # Shared TypeScript config
```

**Apps (deployable applications):**
```
├── apps/
│   └── shell/                   # Main application shell
│       ├── package.json
│       ├── vite.config.ts
│       ├── tsconfig.json
│       └── src/
│           ├── main.tsx
│           ├── router.ts
│           ├── routes/
│           │   ├── __root.tsx
│           │   ├── index.tsx
│           │   ├── login.tsx
│           │   └── _auth.tsx
│           ├── components/
│           │   ├── Sidebar.tsx
│           │   └── AppShell.tsx
│           └── lib/
│               └── mfe-registry.ts
```

**Micro-Frontend Packages:**
```
├── packages/
│   ├── mfe-rentals/             # Rentals micro-frontend
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts         # Public exports
│   │       ├── routes.tsx       # Route definitions
│   │       ├── navigation.ts    # Menu registration
│   │       ├── dialogs.ts       # Dialog registration
│   │       ├── pages/
│   │       ├── features/
│   │       └── forms/
│   │
│   ├── mfe-returns/             # Returns micro-frontend
│   ├── mfe-fleet-management/    # Fleet management micro-frontend
│   ├── mfe-aao/                 # AAO micro-frontend
│   │
│   ├── shared-ui/               # Shared UI components
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── src/
│   │       ├── index.ts
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── ...
│   │
│   ├── shared-utils/            # Shared utilities
│   │   └── src/
│   │       ├── index.ts
│   │       ├── cn.ts
│   │       └── http.ts
│   │
│   ├── shared-state/            # Shared state (auth, etc.)
│   │   └── src/
│   │       ├── index.ts
│   │       ├── auth-store.ts
│   │       └── query-client.ts
│   │
│   └── mfe-types/               # Shared TypeScript types
│       └── src/
│           ├── index.ts
│           ├── navigation.ts
│           └── dialog.ts
```

### Relevant Documentation YOU SHOULD READ THESE BEFORE IMPLEMENTING!

| Documentation | Section | Why |
|--------------|---------|-----|
| [pnpm Workspaces](https://pnpm.io/workspaces) | Setup & Configuration | Workspace protocol and setup |
| [Turborepo Getting Started](https://turbo.build/repo/docs/getting-started/add-to-project) | Add to Existing Project | Turborepo setup in monorepo |
| [Vite Library Mode](https://vite.dev/guide/build#library-mode) | Library Build Configuration | Building MFE packages |
| [vite-plugin-dts](https://github.com/qmhc/vite-plugin-dts) | TypeScript Declaration Generation | Type exports for packages |
| [TanStack Router Docs](https://tanstack.com/router/latest/docs/framework/react/guide/code-based-routing) | Code-Based Routing | Manual route tree construction |
| [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html) | Composite Projects | Monorepo TypeScript setup |

### Patterns to Follow

**Naming Conventions:**
- Micro-frontend packages: `mfe-{domain}` (e.g., `mfe-rentals`, `mfe-returns`)
- Shared packages: `shared-{purpose}` (e.g., `shared-ui`, `shared-utils`)
- Route files: `{feature}.routes.tsx`
- Navigation config: `{feature}.navigation.ts`
- Package names: `@dash/{package-name}` (e.g., `@dash/mfe-rentals`, `@dash/shared-ui`)

**MFE Module Export Pattern:**
```typescript
// packages/mfe-rentals/src/index.ts
export { routes } from './routes';
export { navigation } from './navigation';
export { dialogs } from './dialogs';
export type { RentalsRoutes } from './routes';
```

**Navigation Registration Pattern:**
```typescript
// packages/mfe-types/src/navigation.ts
export interface NavigationItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  pathname?: string;
  children?: NavigationItem[];
}

export interface NavigationGroup {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavigationItem[];
  order: number; // For sorting in sidebar
}
```

**Dialog Registration Pattern:**
```typescript
// packages/mfe-types/src/dialog.ts
export interface DialogDefinition<P = unknown> {
  id: string;
  component: React.ComponentType<P & { onClose: () => void }>;
}

// packages/mfe-rentals/src/dialogs.ts
export const dialogs: DialogDefinition[] = [
  { id: 'RENT_VEHICLE', component: RentNewVehicleDialog },
];
```

**Route Registration Pattern:**
```typescript
// packages/mfe-rentals/src/routes.tsx
import { createRoute, lazyRouteComponent } from '@tanstack/react-router';

export const createRentalsRoutes = (authRoute: typeof import('@dash/shell').authRoute) => [
  createRoute({
    getParentRoute: () => authRoute,
    path: '/rent',
    component: lazyRouteComponent(() => import('./pages/RentPage')),
  }),
];
```

---

## IMPLEMENTATION PLAN

### Phase 1: Monorepo Foundation (Critical Path)

**Objective:** Set up monorepo structure with pnpm workspaces and Turborepo without breaking existing functionality.

**Tasks:**
1. Initialize pnpm workspace configuration
2. Set up Turborepo for build orchestration
3. Create base TypeScript configuration for sharing
4. Restructure existing code into `apps/shell/`
5. Verify application still builds and runs

### Phase 2: Shared Packages Extraction

**Objective:** Extract shared code into reusable packages that all micro-frontends can consume.

**Tasks:**
1. Create `@dash/shared-ui` package with all UI components
2. Create `@dash/shared-utils` package with utilities
3. Create `@dash/shared-state` package with auth store and query client
4. Create `@dash/mfe-types` package with shared TypeScript interfaces
5. Update shell to consume shared packages
6. Verify application still works with extracted packages

### Phase 3: MFE Infrastructure

**Objective:** Build the infrastructure for micro-frontends to register routes, navigation, and dialogs.

**Tasks:**
1. Create MFE registry system in shell
2. Implement dynamic navigation registration
3. Implement dynamic dialog registration
4. Create route composition utilities
5. Document MFE contract/interface

### Phase 4: First Micro-Frontend - Rentals

**Objective:** Extract the rentals feature as the first micro-frontend to validate the architecture.

**Tasks:**
1. Create `@dash/mfe-rentals` package structure
2. Move rentals-related code to the package
3. Implement route, navigation, and dialog exports
4. Integrate rentals MFE with shell
5. Validate end-to-end functionality

### Phase 5: Additional Micro-Frontends

**Objective:** Extract remaining features into micro-frontends.

**Tasks:**
1. Create `@dash/mfe-returns` package
2. Create `@dash/mfe-fleet-management` package (placeholder/stub)
3. Create `@dash/mfe-aao` package
4. Integrate all MFEs with shell
5. Full regression testing

### Phase 6: Build Optimization

**Objective:** Optimize the build for production deployment.

**Tasks:**
1. Configure Turborepo caching
2. Set up proper dependency tracking
3. Configure production builds with tree-shaking
4. Validate bundle sizes
5. Document CI/CD integration

---

## STEP-BY-STEP TASKS

### Phase 1: Monorepo Foundation

#### 1.1 CREATE `pnpm-workspace.yaml` at repository root

- **IMPLEMENT**: Define workspace packages pattern
- **CONTENT**:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```
- **VALIDATE**: `cat pnpm-workspace.yaml`

#### 1.2 CREATE `turbo.json` at repository root

- **IMPLEMENT**: Configure Turborepo pipeline
- **CONTENT**:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    }
  }
}
```
- **VALIDATE**: `npx turbo --version && cat turbo.json`

#### 1.3 CREATE `tsconfig.base.json` at repository root

- **IMPLEMENT**: Base TypeScript configuration for all packages
- **PATTERN**: Mirror current `tsconfig.app.json` settings
- **CONTENT**:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "declaration": true,
    "declarationMap": true,
    "composite": true
  }
}
```
- **VALIDATE**: `npx tsc --showConfig -p tsconfig.base.json`

#### 1.4 UPDATE root `package.json` for monorepo

- **IMPLEMENT**: Add workspace scripts and dev dependencies
- **IMPORTS**: Keep existing dependencies, add turborepo
- **CHANGES**:
```json
{
  "name": "@dash/root",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "typecheck": "turbo run typecheck"
  },
  "devDependencies": {
    "turbo": "^2.5.0"
  }
}
```
- **VALIDATE**: `pnpm install && pnpm turbo --version`

#### 1.5 CREATE `apps/shell/` directory structure

- **IMPLEMENT**: Move existing src/ to apps/shell/src/
- **STEPS**:
  1. Create `apps/shell/` directory
  2. Move `src/`, `public/`, `index.html` to `apps/shell/`
  3. Create `apps/shell/package.json`
  4. Create `apps/shell/vite.config.ts`
  5. Create `apps/shell/tsconfig.json`
- **GOTCHA**: Preserve all existing file paths within src/
- **VALIDATE**: `ls -la apps/shell/src/`

#### 1.6 CREATE `apps/shell/package.json`

- **IMPLEMENT**: Shell application package configuration
- **PATTERN**: Based on current root package.json
- **CONTENT**:
```json
{
  "name": "@dash/shell",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "@dash/shared-ui": "workspace:*",
    "@dash/shared-utils": "workspace:*",
    "@dash/shared-state": "workspace:*",
    "@dash/mfe-types": "workspace:*",
    "@hookform/resolvers": "^5.2.2",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slot": "^1.2.4",
    "@tanstack/react-query": "^5.90.17",
    "@tanstack/react-router": "^1.146.2",
    "@tanstack/react-table": "^8.21.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.562.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-hook-form": "^7.71.1",
    "tailwind-merge": "^3.4.0",
    "vite-plugin-pwa": "^1.2.0",
    "zod": "^4.3.5",
    "zustand": "^5.0.9"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.18",
    "@tanstack/router-plugin": "^1.147.3",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "babel-plugin-react-compiler": "^1.0.0",
    "tailwindcss": "^4.1.18",
    "typescript": "~5.9.3",
    "vite": "^7.2.4",
    "vitest": "^4.0.16"
  }
}
```
- **VALIDATE**: `cat apps/shell/package.json | jq .name`

#### 1.7 CREATE `apps/shell/vite.config.ts`

- **IMPLEMENT**: Shell Vite configuration
- **PATTERN**: Based on current vite.config.ts
- **CONTENT**: Copy current vite.config.ts with updated paths
- **GOTCHA**: Update path aliases to resolve correctly in monorepo
- **VALIDATE**: `pnpm --filter @dash/shell dev` (should start dev server)

#### 1.8 CREATE `apps/shell/tsconfig.json`

- **IMPLEMENT**: Shell TypeScript configuration
- **CONTENT**:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@dash/*": ["../../packages/*/src"]
    },
    "noEmit": true
  },
  "include": ["src/**/*"],
  "references": [
    { "path": "../../packages/shared-ui" },
    { "path": "../../packages/shared-utils" },
    { "path": "../../packages/shared-state" },
    { "path": "../../packages/mfe-types" }
  ]
}
```
- **VALIDATE**: `cd apps/shell && pnpm tsc --noEmit`

### Phase 2: Shared Packages Extraction

#### 2.1 CREATE `packages/mfe-types/` package

- **IMPLEMENT**: Shared TypeScript interfaces for MFE contracts
- **FILES TO CREATE**:
  - `packages/mfe-types/package.json`
  - `packages/mfe-types/tsconfig.json`
  - `packages/mfe-types/src/index.ts`
  - `packages/mfe-types/src/navigation.ts`
  - `packages/mfe-types/src/dialog.ts`
  - `packages/mfe-types/src/routes.ts`
- **VALIDATE**: `pnpm --filter @dash/mfe-types build`

#### 2.2 CREATE `packages/shared-utils/` package

- **IMPLEMENT**: Extract utilities from `src/lib/`
- **FILES TO MOVE**:
  - `src/lib/utils.ts` → `packages/shared-utils/src/cn.ts`
  - `src/lib/api/http.ts` → `packages/shared-utils/src/http.ts`
- **FILES TO CREATE**:
  - `packages/shared-utils/package.json`
  - `packages/shared-utils/vite.config.ts`
  - `packages/shared-utils/tsconfig.json`
  - `packages/shared-utils/src/index.ts`
- **VALIDATE**: `pnpm --filter @dash/shared-utils build`

#### 2.3 CREATE `packages/shared-state/` package

- **IMPLEMENT**: Extract state management
- **FILES TO MOVE**:
  - `src/store/useAuthStore.ts` → `packages/shared-state/src/auth-store.ts`
  - `src/lib/react-query/queryClient.ts` → `packages/shared-state/src/query-client.ts`
  - `src/lib/react-query/queryKeys.ts` → `packages/shared-state/src/query-keys.ts`
- **FILES TO CREATE**:
  - `packages/shared-state/package.json`
  - `packages/shared-state/vite.config.ts`
  - `packages/shared-state/tsconfig.json`
  - `packages/shared-state/src/index.ts`
- **VALIDATE**: `pnpm --filter @dash/shared-state build`

#### 2.4 CREATE `packages/shared-ui/` package

- **IMPLEMENT**: Extract UI components
- **FILES TO MOVE**: All files from `src/components/ui/`
- **FILES TO CREATE**:
  - `packages/shared-ui/package.json`
  - `packages/shared-ui/vite.config.ts`
  - `packages/shared-ui/tsconfig.json`
  - `packages/shared-ui/src/index.ts`
- **GOTCHA**: Update imports in all components to use `@dash/shared-utils` for `cn()`
- **VALIDATE**: `pnpm --filter @dash/shared-ui build`

#### 2.5 UPDATE shell to use shared packages

- **IMPLEMENT**: Update imports throughout shell to use workspace packages
- **CHANGES**:
  - Replace `@/lib/utils` → `@dash/shared-utils`
  - Replace `@/store/useAuthStore` → `@dash/shared-state`
  - Replace `@/lib/react-query/*` → `@dash/shared-state`
  - Replace `@/components/ui/*` → `@dash/shared-ui`
- **VALIDATE**: `pnpm --filter @dash/shell dev`

### Phase 3: MFE Infrastructure

#### 3.1 CREATE MFE registry in shell

- **IMPLEMENT**: Create `apps/shell/src/lib/mfe-registry.ts`
- **CONTENT**:
```typescript
import type { NavigationGroup, DialogDefinition } from '@dash/mfe-types';
import { RouteObject } from '@tanstack/react-router';

interface MFERegistration {
  id: string;
  navigation?: NavigationGroup[];
  dialogs?: DialogDefinition[];
  routes?: RouteObject[];
}

class MFERegistry {
  private registrations: Map<string, MFERegistration> = new Map();

  register(mfe: MFERegistration) {
    this.registrations.set(mfe.id, mfe);
  }

  getAllNavigation(): NavigationGroup[] {
    return Array.from(this.registrations.values())
      .flatMap(r => r.navigation ?? [])
      .sort((a, b) => a.order - b.order);
  }

  getAllDialogs(): Map<string, DialogDefinition> {
    const dialogs = new Map();
    for (const reg of this.registrations.values()) {
      for (const dialog of reg.dialogs ?? []) {
        dialogs.set(dialog.id, dialog);
      }
    }
    return dialogs;
  }

  getAllRoutes(): RouteObject[] {
    return Array.from(this.registrations.values())
      .flatMap(r => r.routes ?? []);
  }
}

export const mfeRegistry = new MFERegistry();
```
- **VALIDATE**: TypeScript compilation passes

#### 3.2 UPDATE Sidebar for dynamic navigation

- **IMPLEMENT**: Refactor `apps/shell/src/components/Sidebar.tsx`
- **PATTERN**: Replace hardcoded `menuItems` with registry lookup
- **CHANGES**:
  - Import `mfeRegistry` from `@/lib/mfe-registry`
  - Replace `menuItems` constant with `mfeRegistry.getAllNavigation()`
  - Keep UI structure the same
- **GOTCHA**: Maintain backward compatibility during migration
- **VALIDATE**: Sidebar renders with dynamic items

#### 3.3 UPDATE GlobalDialog for dynamic registration

- **IMPLEMENT**: Refactor `apps/shell/src/components/dialogs/global-dialog.tsx`
- **PATTERN**: Replace `DialogMap` with registry lookup
- **CHANGES**:
  - Import `mfeRegistry` from `@/lib/mfe-registry`
  - Replace `DialogMap` with dynamic lookup
  - Keep `DialogRegistry` type for type safety
- **VALIDATE**: Dialogs still open correctly

#### 3.4 CREATE route composition utility

- **IMPLEMENT**: Create `apps/shell/src/lib/route-composer.ts`
- **PURPOSE**: Compose routes from MFE registrations
- **CONTENT**: Utility to merge MFE routes with shell routes
- **VALIDATE**: Routes can be composed programmatically

### Phase 4: First Micro-Frontend - Rentals

#### 4.1 CREATE `packages/mfe-rentals/` package structure

- **IMPLEMENT**: Create package with proper structure
- **FILES TO CREATE**:
  - `packages/mfe-rentals/package.json`
  - `packages/mfe-rentals/vite.config.ts`
  - `packages/mfe-rentals/tsconfig.json`
  - `packages/mfe-rentals/src/index.ts`
- **VALIDATE**: `pnpm --filter @dash/mfe-rentals build`

#### 4.2 MOVE rentals code to MFE package

- **IMPLEMENT**: Move rentals-specific code
- **FILES TO MOVE**:
  - `src/pages/RentPage.tsx` → `packages/mfe-rentals/src/pages/RentPage.tsx`
  - `src/features/rent-vehicle/` → `packages/mfe-rentals/src/features/rent-vehicle/`
  - `src/forms/rent/` → `packages/mfe-rentals/src/forms/rent/`
  - `src/components/dialogs/rent-new-vehicle/` → `packages/mfe-rentals/src/dialogs/rent-new-vehicle/`
- **GOTCHA**: Update all imports to use shared packages
- **VALIDATE**: Files moved without import errors

#### 4.3 CREATE rentals navigation export

- **IMPLEMENT**: Create `packages/mfe-rentals/src/navigation.ts`
- **CONTENT**:
```typescript
import { Car } from 'lucide-react';
import type { NavigationGroup } from '@dash/mfe-types';

export const navigation: NavigationGroup[] = [
  {
    id: 'counter-functions-rentals',
    label: 'Counter Functions',
    icon: Car,
    order: 10,
    items: [
      { label: 'Rent', icon: Car, pathname: '/rent' },
      { label: 'Post Rent', pathname: '/post-rent' },
    ],
  },
];
```
- **VALIDATE**: Export is type-safe

#### 4.4 CREATE rentals dialog export

- **IMPLEMENT**: Create `packages/mfe-rentals/src/dialogs.ts`
- **CONTENT**: Export dialog definitions
- **VALIDATE**: Dialogs can be imported

#### 4.5 CREATE rentals routes export

- **IMPLEMENT**: Create `packages/mfe-rentals/src/routes.tsx`
- **CONTENT**: Export route definitions as factory
- **VALIDATE**: Routes are properly typed

#### 4.6 UPDATE shell to consume rentals MFE

- **IMPLEMENT**: Register rentals MFE in shell
- **CHANGES**:
  - Add `@dash/mfe-rentals` to shell dependencies
  - Import and register in `apps/shell/src/main.tsx`
  - Add route to router
- **VALIDATE**: `pnpm --filter @dash/shell dev` - navigate to /rent

### Phase 5: Additional Micro-Frontends

#### 5.1 CREATE `packages/mfe-returns/` following rentals pattern

- **MIRROR**: `packages/mfe-rentals/` structure
- **FILES TO MOVE**:
  - `src/pages/ReturnPage.tsx`
  - `src/forms/return/`
- **VALIDATE**: Returns MFE builds and integrates

#### 5.2 CREATE `packages/mfe-fleet-management/` as stub

- **IMPLEMENT**: Create package with placeholder content
- **PURPOSE**: Demonstrate extensibility for future features
- **VALIDATE**: Package builds and registers

#### 5.3 CREATE `packages/mfe-aao/` following pattern

- **MIRROR**: Standard MFE structure
- **FILES TO MOVE**:
  - `src/pages/AaoPage.tsx`
- **VALIDATE**: AAO MFE builds and integrates

#### 5.4 UPDATE shell to register all MFEs

- **IMPLEMENT**: Import and register all MFEs
- **VALIDATE**: Full application works with all MFEs

### Phase 6: Build Optimization

#### 6.1 CONFIGURE Turborepo caching

- **IMPLEMENT**: Optimize turbo.json for caching
- **CHANGES**: Add proper inputs/outputs for cache invalidation
- **VALIDATE**: `pnpm turbo build --dry-run` shows cache hits

#### 6.2 CONFIGURE production builds

- **IMPLEMENT**: Optimize Vite configs for production
- **CHANGES**:
  - Enable tree-shaking
  - Configure chunk splitting
  - Set up proper externals
- **VALIDATE**: `pnpm build && du -sh apps/shell/dist`

#### 6.3 DOCUMENT CI/CD integration

- **IMPLEMENT**: Create `.github/workflows/ci.yml` (if using GitHub)
- **CONTENT**: Turborepo-optimized CI workflow
- **VALIDATE**: Documentation is complete

---

## TESTING STRATEGY

### Unit Tests

**Scope:** Each shared package and MFE should have unit tests for utilities and hooks.

**Framework:** Vitest (already configured)

**Coverage Requirements:**
- Shared packages: 80%+ coverage
- MFE business logic: 70%+ coverage

### Integration Tests

**Scope:** Test MFE registration and composition in shell.

**Key Tests:**
- MFE registration adds navigation items
- MFE dialogs are accessible
- MFE routes are navigable
- Shared state works across MFEs

### E2E Tests

**Scope:** Critical user journeys through multiple MFEs.

**Framework:** Playwright (already configured)

**Key Journeys:**
- Login → Dashboard → Rent Page → Add Vehicle
- Login → Dashboard → Return Page → Submit Return

---

## VALIDATION COMMANDS

Execute every command to ensure zero regressions and 100% feature correctness.

### Level 1: Install & Build

```bash
# Install all dependencies
pnpm install

# Build all packages (respects dependency order)
pnpm turbo build

# Check for TypeScript errors
pnpm turbo typecheck
```

### Level 2: Linting

```bash
# Run ESLint across all packages
pnpm turbo lint
```

### Level 3: Unit Tests

```bash
# Run all tests
pnpm turbo test

# Run with coverage
pnpm --filter @dash/shell test:coverage
```

### Level 4: Development Server

```bash
# Start development (all packages in parallel)
pnpm dev

# Or just the shell
pnpm --filter @dash/shell dev
```

### Level 5: Production Build Validation

```bash
# Build and preview production
pnpm build
pnpm --filter @dash/shell preview
```

### Level 6: Manual Validation

1. Navigate to `http://localhost:5173`
2. Login with test credentials
3. Verify sidebar shows all navigation items
4. Navigate to each route (/rent, /return, /aao)
5. Open "Add New Vehicle" dialog from rent page
6. Submit rent form
7. Check browser console for errors

---

## ACCEPTANCE CRITERIA

- [x] Monorepo structure created with pnpm workspaces
- [x] Turborepo configured for build orchestration
- [x] All shared packages extracted and building independently
- [x] At least one MFE (rentals) extracted and working
- [x] Dynamic navigation registration working
- [x] Dynamic dialog registration working
- [x] All existing functionality preserved (no regressions) - **Verified via browser testing**
- [x] Build time comparable or faster than monolithic build
- [x] Type safety maintained across package boundaries
- [x] Development workflow documented

---

## COMPLETION CHECKLIST

- [x] All Phase 1 tasks completed (monorepo foundation)
- [x] All Phase 2 tasks completed (shared packages)
- [x] All Phase 3 tasks completed (MFE infrastructure)
- [x] All Phase 4 tasks completed (rentals MFE)
- [x] All Phase 5 tasks completed (additional MFEs)
- [x] All Phase 6 tasks completed (build optimization)
- [x] All validation commands pass (TypeScript, Build)
- [x] Manual testing confirms full functionality - **Verified via browser testing**
- [x] Team documentation updated

---

## NOTES

### Design Decisions

1. **Build-time over runtime federation**: Chose build-time composition for simpler debugging, better performance, and easier deployment. Runtime federation can be added later if independent deployments become necessary.

2. **pnpm over npm/yarn**: pnpm provides better disk efficiency, stricter dependency resolution, and excellent workspace support.

3. **Turborepo over Nx**: Turborepo is simpler to configure and sufficient for this project's scale. Nx would be considered for polyglot or very large repositories.

4. **Factory pattern for routes**: MFEs export route factory functions rather than routes directly, allowing the shell to control parent routes and maintain type safety.

5. **Keep forms in MFEs**: Forms are domain-specific and belong in their respective MFEs rather than shared packages.

### Trade-offs

| Decision | Benefit | Cost |
|----------|---------|------|
| Build-time bundling | Simple deployment, better performance | Cannot deploy MFEs independently |
| Monorepo | Shared tooling, atomic commits | Larger repository size |
| Workspace packages | Type safety across boundaries | Additional build complexity |

### Future Evolution

1. **Runtime Federation**: If independent deployments become necessary, add `@module-federation/vite` to enable runtime loading while keeping build-time as fallback.

2. **Micro-Frontend Templates**: Create a package generator script (`pnpm create-mfe <name>`) to scaffold new MFEs.

3. **Shared CSS**: Consider extracting Tailwind configuration to a shared package if design tokens need synchronization.

### Migration Strategy

This plan preserves the existing application while progressively extracting code. At any point during migration:
- The application remains fully functional
- Rollback is possible by reverting monorepo changes
- Teams can be onboarded incrementally

### Risks

| Risk | Mitigation |
|------|------------|
| TypeScript errors across packages | Use project references and strict mode |
| Circular dependencies | Enforce dependency graph with ESLint rules |
| Build time increase | Turborepo caching minimizes rebuilds |
| Developer experience regression | Maintain hot reload across all packages |
