---
phase: 01-infrastructure
plan: 02
subsystem: infra
tags: [workspace, typescript, pnpm, radix-ui, react-query, mitt, event-bus]

# Dependency graph
requires:
  - phase: 01-01
    provides: Workspace structure with pnpm configuration and TypeScript project references

provides:
  - "@packages/ui with Radix-based components (Button, Card, Dialog, Input, Label, Collapsible, Separator, Sheet)"
  - "@packages/api-client with React Query and http utilities"
  - "@packages/event-bus with typed mitt for cross-MFE communication"
  - "TypeScript composite builds for all shared packages"

affects: [01-03, 01-04, 02-rentals, 02-returns, 02-aao]

# Tech tracking
tech-stack:
  added:
    - "@radix-ui/react-collapsible: ^1.1.12"
    - "@radix-ui/react-dialog: ^1.1.15"
    - "@radix-ui/react-label: ^2.1.8"
    - "@radix-ui/react-separator: ^1.1.8"
    - "@radix-ui/react-slot: ^1.2.4"
    - "class-variance-authority: ^0.7.1"
    - "clsx: ^2.1.1"
    - "tailwind-merge: ^3.4.0"
    - "lucide-react: ^0.562.0"
    - "mitt: ^3.0.1"
    - "@tanstack/react-query: ^5.90.17"
  patterns:
    - "TypeScript composite projects with tsc -b for package builds"
    - "Barrel exports (index.ts) for clean package APIs"
    - "Typed event bus pattern for cross-MFE communication"
    - "cn utility function for Tailwind class merging"

key-files:
  created:
    - packages/ui/package.json
    - packages/ui/src/index.ts
    - packages/ui/src/lib/utils.ts
    - packages/ui/src/components/*.tsx
    - packages/api-client/package.json
    - packages/api-client/src/index.ts
    - packages/api-client/src/http.ts
    - packages/api-client/src/query-client.ts
    - packages/api-client/src/queryKeys.ts
    - packages/event-bus/package.json
    - packages/event-bus/src/index.ts
    - packages/event-bus/src/events.ts
    - packages/event-bus/src/bus.ts
  modified:
    - tsconfig.base.json
    - pnpm-lock.yaml
    - apps/shell/src/features/rent-vehicle/api.ts
    - apps/shell/src/features/rent-vehicle/query.ts
    - apps/shell/src/features/rent-vehicle/mutations.ts

key-decisions:
  - "Removed allowImportingTsExtensions from tsconfig.base.json (incompatible with emitting declarations)"
  - "Consolidated shared-ui, shared-utils, shared-state into single @packages/ui package"
  - "Used mitt for event bus (lightweight, typed, simple API)"
  - "Defined standard MFE event types: navigation, data-refresh, notification, auth-state-changed"

patterns-established:
  - "Shared packages use TypeScript composite: true with tsc -b for builds"
  - "Package exports define both types and import paths"
  - "UI components import cn utility via relative paths"
  - "Event bus exports both eventBus singleton and type definitions"

# Metrics
duration: 7min
completed: 2026-01-22
---

# Phase 01 Plan 02: Shared Packages Summary

**Three buildable workspace packages with Radix UI components, React Query client, and typed event bus for cross-MFE communication**

## Performance

- **Duration:** 7 min
- **Started:** 2026-01-22T14:39:28Z
- **Completed:** 2026-01-22T14:46:43Z
- **Tasks:** 3 (plus 1 deviation fix)
- **Files modified:** 25

## Accomplishments

- Created @packages/ui with 8 Radix-based UI components and cn utility
- Created @packages/api-client with React Query setup and http client
- Created @packages/event-bus with typed mitt event system
- All packages build successfully with TypeScript composite configuration
- Fixed tsconfig.base.json to enable declaration file emission

## Task Commits

Each task was committed atomically:

1. **Task 1: Set up @packages/ui with extracted Radix components** - `4148790` (feat)
2. **Task 2: Set up @packages/api-client with React Query** - `4148790` (feat - included in previous commit)
3. **Task 3: Set up @packages/event-bus with typed mitt** - `7a9431f` (feat)
4. **Deviation: Update shell imports to use workspace packages** - `58adddf` (fix)

## Files Created/Modified

### @packages/ui
- `package.json` - UI component library package config with Radix dependencies
- `tsconfig.json` - TypeScript composite configuration extending tsconfig.base.json
- `src/index.ts` - Barrel exports for all components and utilities
- `src/lib/utils.ts` - cn utility for Tailwind class merging
- `src/components/button.tsx` - Button component with variants (default, destructive, outline, secondary, ghost, link, sidebar, sidebarActive)
- `src/components/card.tsx` - Card component with Header, Title, Description, Content, Footer
- `src/components/dialog.tsx` - Dialog component with Radix Dialog primitive wrappers
- `src/components/input.tsx` - Input component with focus states
- `src/components/label.tsx` - Label component with Radix Label primitive
- `src/components/collapsible.tsx` - Collapsible component exports
- `src/components/separator.tsx` - Separator component for horizontal/vertical dividers
- `src/components/sheet.tsx` - Sheet component (slide-in panel) with side variants

### @packages/api-client
- `package.json` - API client package config with React Query dependency
- `tsconfig.json` - TypeScript composite configuration
- `src/index.ts` - Barrel exports for queryClient, queryKeys, http
- `src/http.ts` - Generic http fetch wrapper with JSON handling
- `src/query-client.ts` - Configured QueryClient with default options
- `src/queryKeys.ts` - Query key factory for React Query

### @packages/event-bus
- `package.json` - Event bus package config with mitt dependency
- `tsconfig.json` - TypeScript composite configuration
- `src/index.ts` - Barrel exports for eventBus and event types
- `src/events.ts` - Typed event definitions (MfeEvents interface with NavigationEvent, DataRefreshEvent, NotificationEvent, AuthStateChangedEvent)
- `src/bus.ts` - Typed mitt event bus singleton

### Configuration
- `tsconfig.base.json` - Removed allowImportingTsExtensions (blocked declaration emission)

### Shell Updates
- `apps/shell/src/features/rent-vehicle/api.ts` - Updated to import http from @packages/api-client
- `apps/shell/src/features/rent-vehicle/query.ts` - Updated to import queryKeys from @packages/api-client
- `apps/shell/src/features/rent-vehicle/mutations.ts` - Updated imports (commented code)

## Decisions Made

**1. TypeScript Configuration Fix**
- Removed `allowImportingTsExtensions` from tsconfig.base.json
- **Rationale:** This option is incompatible with `noEmit: false` and `declaration: true`, which are required for emitting .d.ts files from packages
- **Impact:** Packages can now build with `tsc -b` and generate type declarations

**2. Package Consolidation**
- Merged shared-ui, shared-utils, shared-state stub directories into single @packages/ui
- **Rationale:** UI components and utilities are tightly coupled, single package reduces overhead
- **Impact:** Simpler dependency graph, fewer packages to maintain

**3. Event Bus Design**
- Used mitt instead of custom event emitter
- **Rationale:** Lightweight (200 bytes), typed API, simple to use
- **Impact:** Type-safe cross-MFE communication with minimal overhead

**4. Standard Event Types**
- Defined four core event types: navigation:change, data:refresh, notification:show, auth:state-changed
- **Rationale:** Cover most common cross-MFE communication patterns
- **Impact:** MFEs have standard events to work with, extensible via MfeEvents type

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript configuration blocking builds**
- **Found during:** Task 1 (@packages/ui build)
- **Issue:** `allowImportingTsExtensions: true` incompatible with emitting declaration files - TypeScript error TS5096
- **Fix:** Removed `allowImportingTsExtensions` from tsconfig.base.json
- **Files modified:** tsconfig.base.json
- **Verification:** All packages build successfully with `tsc -b`
- **Committed in:** 4148790 (Task 1 commit)

**2. [Rule 3 - Blocking] Updated shell imports to use workspace packages**
- **Found during:** Verification (`pnpm -r build` failed on shell)
- **Issue:** Shell still importing from @/lib/api/http and @/lib/react-query/queryKeys which were moved to @packages/api-client
- **Fix:** Updated imports in apps/shell/src/features/rent-vehicle/{api,query,mutations}.ts to use @packages/api-client
- **Files modified:** apps/shell/src/features/rent-vehicle/api.ts, query.ts, mutations.ts
- **Verification:** Shell builds successfully with `vite build`
- **Committed in:** 58adddf (separate fix commit)

---

**Total deviations:** 2 auto-fixed (1 bug, 1 blocking)
**Impact on plan:** Both fixes essential for packages to build. No scope creep - addressed blocking technical issues.

## Issues Encountered

None beyond the auto-fixed deviations. All packages built on first attempt after TypeScript config fix.

## User Setup Required

None - no external service configuration required. All packages use local workspace dependencies.

## Next Phase Readiness

**Ready for next phase:**
- All shared packages build successfully
- TypeScript declarations emitted for type-safe imports
- Shell app verified to import from workspace packages
- Event bus ready for cross-MFE communication

**Blockers/Concerns:**
None. Shell still has duplicate UI components in apps/shell/src/components/ui/ that should be replaced with @packages/ui imports in a future plan, but this doesn't block MFE development.

**Import wiring note:**
Plan specified that import wiring verification happens in Plan 01-04. This plan completed package creation and standalone builds. The shell import fixes were necessary to unblock builds but full import migration will be addressed in Plan 01-04.

---
*Phase: 01-infrastructure*
*Completed: 2026-01-22*
