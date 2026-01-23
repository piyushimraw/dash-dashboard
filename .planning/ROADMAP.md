# Roadmap: Car Rental Dashboard MFE Migration

## Overview

Migrate monolithic React SPA to build-time microfrontend architecture with 9 independently-owned MFEs that compile into a single deploy artifact. The migration follows Strangler Fig pattern across three major phases: establish infrastructure (monorepo, shared packages, shell), migrate all MFEs to new architecture, then optimize and prepare for production deployment.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Infrastructure** - Monorepo, shared packages, shell with MFE orchestration
- [x] **Phase 2: MFE Migration** - All 9 page-level MFEs with lazy loading
- [x] **Phase 3: Production Ready** - Build optimization, Docker, documentation
- [x] **Phase 4: PWA & Offline Support** - Full PWA and offline support for Reservation Lookup module
- [x] **Phase 5: Installation Banner** - PWA install prompt to encourage app installation from browser

## Phase Details

### Phase 1: Infrastructure
**Goal**: Establish monorepo foundation with shared packages and shell infrastructure for MFE orchestration
**Depends on**: Nothing (first phase)
**Requirements**: MONO-01, MONO-02, MONO-03, MONO-04, SHELL-01, SHELL-02, SHELL-03, SHELL-04, SHELL-05, SHELL-06, SHELL-07, MFE-03, MFE-04
**Success Criteria** (what must be TRUE):
  1. Project uses pnpm workspaces with packages/ and apps/ directory structure
  2. TypeScript project references enable cross-package type checking without errors
  3. Shared tsconfig.base.json and eslint.config.js apply to all packages
  4. Path aliases (@packages/*, @apps/*) resolve correctly in all packages
  5. UI component library (@packages/ui) exists with existing Radix + Tailwind components
  6. API client package (@packages/api-client) provides React Query setup and interceptors
  7. Event bus package (@packages/event-bus) implements mitt with typed event contracts
  8. Type contracts package (@packages/mfe-types) defines MFE-shell interfaces
  9. Shell provides auth service with login state, session management, and role checks
  10. TanStack Router configured for route-based lazy loading with placeholder routes
  11. Layout components (sidebar, header, footer) extracted and render in shell
  12. MFE registry tracks metadata (name, routes, version) for each MFE
  13. Error boundaries isolate failures so one MFE crash doesn't break shell
  14. All shared packages build independently and can be imported by other packages
  15. User can log in, navigate to placeholder routes, and see layout consistently
**Plans**: 8 plans

Plans:
- [x] 01-01-PLAN.md - Initialize pnpm workspace and TypeScript project references
- [x] 01-02-PLAN.md - Create @packages/ui, @packages/api-client, @packages/event-bus
- [x] 01-03-PLAN.md - Create @packages/mfe-types with MFE registry and auth contracts
- [x] 01-04-PLAN.md - Migrate src/ to apps/shell with workspace package imports
- [x] 01-05-PLAN.md - Implement auth service with role-based access control
- [x] 01-06-PLAN.md - Extract layout components (collapsible sidebar, header, footer)
- [x] 01-07-PLAN.md - Create MFE registry service and error boundaries
- [x] 01-08-PLAN.md - Configure routes with error boundaries and verify integration

### Phase 2: MFE Migration
**Goal**: Migrate all 9 page-level features to independent MFEs with lazy loading and event-based communication
**Depends on**: Phase 1
**Requirements**: MFE-01, MFE-02, MFE-05, MFE-06, MFE-07, MFE-08, MFE-09, MFE-10, MFE-11, MFE-12, MFE-13
**Success Criteria** (what must be TRUE):
  1. All 9 MFEs exist as separate packages in apps/ directory (dashboard, rent, return, vehicle-exchange, reservation-lookup, car-control, aao, reports, settings)
  2. Each MFE lazy-loads on its route via TanStack Router .lazy.tsx pattern with isolated bundles
  3. All MFEs use shell services (auth, API client, UI components, event bus) without duplication
  4. Cross-MFE communication works via event bus (e.g., rent completion triggers refresh in other MFEs)
  5. Build produces separate chunk for each MFE (verified in dist/)
  6. Dashboard displays full functionality with no regressions
  7. Rental workflows (rent, return, exchange) function identically to monolith version
  8. Reservation lookup integrates with rental MFEs via event bus
  9. Fleet management (car control) and AAO features work in isolated MFEs
  10. Reports and settings pages maintain all existing functionality
  11. Complete feature parity achieved with original monolith across all pages
  12. User can navigate between all MFEs and complete all workflows without issues
**Plans**: 9 plans

Plans:
- [x] 02-01-PLAN.md - Extract form components (FormProvider, FormInput, FormSelect) to @packages/ui
- [x] 02-02-PLAN.md - Extract DataTable and table primitives to @packages/ui
- [x] 02-03-PLAN.md - Create 5 simple MFE packages (settings, reports, aao, car-control, vehicle-exchange)
- [x] 02-04-PLAN.md - Wire simple MFE routes to shell (5 routes)
- [x] 02-05-PLAN.md - Create mfe-dashboard with @packages/ui components
- [x] 02-06-PLAN.md - Create mfe-rent with form validation
- [x] 02-07-PLAN.md - Create mfe-return with form validation
- [x] 02-08-PLAN.md - Create mfe-reservation-lookup with DataTable and queries
- [x] 02-09-PLAN.md - Final cleanup and human verification of all routes

### Phase 3: Production Ready
**Goal**: Optimize bundle size, containerize for production, and document architecture for team
**Depends on**: Phase 2
**Requirements**: BUILD-01, BUILD-02, BUILD-03, BUILD-04, DOCKER-01, DOCKER-02, DOCKER-03, DOCKER-04, DOCS-01, DOCS-02, DOCS-03, DOCS-04
**Success Criteria** (what must be TRUE):
  1. Vite manualChunks configured to separate MFE bundles and shared vendor chunks
  2. Shared dependencies (React, Radix UI) deduplicated into single vendor bundle
  3. Build produces single deploy artifact containing all MFEs and shell
  4. Bundle size monitoring approach documented (CI automation deferred to v2)
  5. Initial page load only downloads shell + first route's MFE chunk
  6. Dockerfile builds production static assets from all MFEs
  7. docker-compose.yml orchestrates local production demo environment
  8. nginx configuration serves static bundles with correct headers
  9. Local docker setup demonstrates code splitting and lazy loading in production mode
  10. ARCHITECTURE.md documents full MFE structure with mermaid diagrams
  11. Contract documentation explains event bus events and shared type interfaces
  12. Build and deployment instructions documented with examples
  13. README.md updated with dev build instructions and architecture overview
  14. User can run docker-compose up and access fully functional production build
  15. New developer can understand architecture and run project from documentation alone
**Plans**: 3 plans

Plans:
- [x] 03-01-PLAN.md - Configure Vite manualChunks for vendor splitting and bundle analysis
- [x] 03-02-PLAN.md - Create Docker production setup with multi-stage build and nginx
- [x] 03-03-PLAN.md - Update ARCHITECTURE.md, create CONTRACTS.md, update README.md

### Phase 4: PWA & Offline Support
**Goal**: Introduce full PWA and offline support for the Reservation Lookup module
**Depends on**: Phase 3
**Requirements**: PWA-01, PWA-02, PWA-03, PWA-04, PWA-05
**Success Criteria** (what must be TRUE):
  1. Service worker caches API responses from reservation endpoint using NetworkFirst strategy
  2. React Query cache persists to IndexedDB across page reloads
  3. Queries fire when offline, allowing service worker to serve cached responses
  4. User sees offline indicator banner when viewing cached data offline
  5. Offline fallback page displays when navigating to uncached routes
  6. Reservation Lookup displays previously loaded data when offline
  7. Offline indicator disappears when network connection is restored
  8. Human verification confirms complete offline workflow functions correctly
**Plans**: 3 plans

Plans:
- [x] 04-01-PLAN.md - Configure service worker runtime caching and offline fallback
- [x] 04-02-PLAN.md - Implement React Query persistence to IndexedDB
- [x] 04-03-PLAN.md - Create offline UX components and verify integration

### Phase 5: Installation Banner
**Goal**: Add PWA installation prompt banner to encourage users to install the application from browser
**Depends on**: Phase 4
**Requirements**: PWA-06
**Success Criteria** (what must be TRUE):
  1. App detects when PWA installation is available via beforeinstallprompt event
  2. Installation banner displays prominently when install is available
  3. Banner includes install button that triggers native installation prompt
  4. Banner can be dismissed and respects user's dismissal preference
  5. Banner does not appear if app is already installed (standalone mode)
  6. Installation success tracked and banner hidden after successful install
  7. Human verification confirms installation flow works on supported browsers
**Plans**: 1 plan

Plans:
- [x] 05-01-PLAN.md - Refactor install hook and banner with brand styling and animation

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Infrastructure | 8/8 | Complete | 2026-01-22 |
| 2. MFE Migration | 9/9 | Complete | 2026-01-23 |
| 3. Production Ready | 3/3 | Complete | 2026-01-23 |
| 4. PWA & Offline Support | 3/3 | Complete | 2026-01-23 |
| 5. Installation Banner | 1/1 | Complete | 2026-01-23 |

---
*Roadmap created: 2026-01-22*
*Last updated: 2026-01-23 (Phase 5 complete - Milestone complete)*
