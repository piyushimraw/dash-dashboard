# Requirements: Car Rental Dashboard MFE Migration

**Defined:** 2026-01-22
**Core Value:** Clear team ownership boundaries with type-safe contracts, enabling parallel development while maintaining unified deployment.

## v1 Requirements

Requirements for MFE migration. Each maps to roadmap phases.

### Monorepo Infrastructure

- [x] **MONO-01**: Project uses pnpm workspaces for package management
- [x] **MONO-02**: TypeScript project references enable cross-package type checking
- [x] **MONO-03**: Shared tsconfig.base.json and eslint.config.js across all packages
- [x] **MONO-04**: Path aliases (@packages/*, @apps/*) work across all packages

### Shell Architecture

- [x] **SHELL-01**: Shell provides auth service (login state, session, role checks)
- [x] **SHELL-02**: Shell orchestrates routing via TanStack Router with lazy MFE loading
- [x] **SHELL-03**: Shell provides layout components (sidebar, header, footer)
- [x] **SHELL-04**: Shared UI component library extracted to @packages/ui
- [x] **SHELL-05**: API client with React Query setup in @packages/api-client
- [x] **SHELL-06**: Event bus (mitt) for cross-MFE communication in @packages/event-bus
- [x] **SHELL-07**: MFE registry with metadata (name, routes, version) for each MFE

### MFE Structure

- [x] **MFE-01**: Each page-level MFE exists as separate package in apps/
- [x] **MFE-02**: MFEs lazy-load via route-based code splitting
- [x] **MFE-03**: Type-safe contracts defined in @packages/mfe-types
- [x] **MFE-04**: Error boundaries isolate MFE failures (one crash doesn't break others)
- [x] **MFE-05**: mfe-dashboard implemented and integrated
- [x] **MFE-06**: mfe-rent implemented and integrated
- [x] **MFE-07**: mfe-return implemented and integrated
- [x] **MFE-08**: mfe-vehicle-exchange implemented and integrated
- [x] **MFE-09**: mfe-reservation-lookup implemented and integrated
- [x] **MFE-10**: mfe-car-control implemented and integrated
- [x] **MFE-11**: mfe-aao implemented and integrated
- [x] **MFE-12**: mfe-reports implemented and integrated
- [x] **MFE-13**: mfe-settings implemented and integrated

### Build & Bundle

- [x] **BUILD-01**: Vite manualChunks configured for MFE code splitting
- [x] **BUILD-02**: Shared dependencies deduplicated (not bundled per MFE)
- [x] **BUILD-03**: Build produces single deploy artifact with all MFEs
- [x] **BUILD-04**: Bundle size monitoring approach documented (CI automation deferred to v2)

### Documentation

- [x] **DOCS-01**: ARCHITECTURE.md documents full MFE structure with mermaid diagrams
- [x] **DOCS-02**: Contract documentation (event bus events, shared types)
- [x] **DOCS-03**: Build and deployment instructions documented
- [x] **DOCS-04**: README.md updated with dev build instructions and architecture diagrams

### Docker Setup

- [x] **DOCKER-01**: Dockerfile builds production static assets
- [x] **DOCKER-02**: docker-compose.yml orchestrates local production demo
- [x] **DOCKER-03**: nginx configuration serves static bundles
- [x] **DOCKER-04**: Local setup demonstrates code splitting and lazy loading

### PWA & Offline Support

- [x] **PWA-01**: Service worker caches API responses using NetworkFirst strategy
- [x] **PWA-02**: React Query cache persists to IndexedDB across page reloads
- [x] **PWA-03**: Queries fire when offline, allowing service worker to serve cached responses
- [x] **PWA-04**: User sees offline indicator banner when viewing cached data offline
- [x] **PWA-05**: Offline fallback page displays when navigating to uncached routes

## v2 Requirements

Deferred to future. Not in current roadmap.

### Advanced Features

- **ADV-01**: Turborepo for build caching and incremental builds
- **ADV-02**: MFE-level feature flags
- **ADV-03**: Performance budgets per MFE with CI enforcement
- **ADV-04**: Visual bundle analysis dashboard
- **ADV-05**: Dynamic route registration (runtime MFE discovery)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Runtime Module Federation | Contradicts single-artifact requirement; adds runtime complexity |
| Independent MFE deployment | Single artifact chosen for simpler ops |
| Server-side rendering | Client-side SPA sufficient for internal tool |
| Micro-services backend | Frontend architecture only; backend unchanged |
| Independent MFE versioning | Single deploy means unified versioning |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| MONO-01 | Phase 1 | Complete |
| MONO-02 | Phase 1 | Complete |
| MONO-03 | Phase 1 | Complete |
| MONO-04 | Phase 1 | Complete |
| SHELL-01 | Phase 1 | Complete |
| SHELL-02 | Phase 1 | Complete |
| SHELL-03 | Phase 1 | Complete |
| SHELL-04 | Phase 1 | Complete |
| SHELL-05 | Phase 1 | Complete |
| SHELL-06 | Phase 1 | Complete |
| SHELL-07 | Phase 1 | Complete |
| MFE-01 | Phase 2 | Complete |
| MFE-02 | Phase 2 | Complete |
| MFE-03 | Phase 1 | Complete |
| MFE-04 | Phase 1 | Complete |
| MFE-05 | Phase 2 | Complete |
| MFE-06 | Phase 2 | Complete |
| MFE-07 | Phase 2 | Complete |
| MFE-08 | Phase 2 | Complete |
| MFE-09 | Phase 2 | Complete |
| MFE-10 | Phase 2 | Complete |
| MFE-11 | Phase 2 | Complete |
| MFE-12 | Phase 2 | Complete |
| MFE-13 | Phase 2 | Complete |
| BUILD-01 | Phase 3 | Complete |
| BUILD-02 | Phase 3 | Complete |
| BUILD-03 | Phase 3 | Complete |
| BUILD-04 | Phase 3 | Complete |
| DOCS-01 | Phase 3 | Complete |
| DOCS-02 | Phase 3 | Complete |
| DOCS-03 | Phase 3 | Complete |
| DOCS-04 | Phase 3 | Complete |
| DOCKER-01 | Phase 3 | Complete |
| DOCKER-02 | Phase 3 | Complete |
| DOCKER-03 | Phase 3 | Complete |
| DOCKER-04 | Phase 3 | Complete |
| PWA-01 | Phase 4 | Complete |
| PWA-02 | Phase 4 | Complete |
| PWA-03 | Phase 4 | Complete |
| PWA-04 | Phase 4 | Complete |
| PWA-05 | Phase 4 | Complete |

**Coverage:**
- v1 requirements: 41 total
- Mapped to phases: 41
- Unmapped: 0

---
*Requirements defined: 2026-01-22*
*Last updated: 2026-01-23 (all requirements complete)*
