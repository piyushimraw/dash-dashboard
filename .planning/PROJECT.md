# Car Rental Management Dashboard — MFE Migration

## What This Is

A car rental management dashboard being migrated to a build-time microfrontend architecture. The system allows rental operations staff to manage vehicle rentals, returns, exchanges, reservations, and fleet control. The migration restructures the codebase into independently-owned MFEs that compile into a single deploy artifact with route-based lazy loading.

## Core Value

Clear team ownership boundaries with type-safe contracts, enabling parallel development while maintaining a unified user experience and single deployment.

## Requirements

### Validated

<!-- Shipped and confirmed working in current codebase -->

- ✓ Authentication with role-based access — existing
- ✓ Dashboard overview page — existing
- ✓ Rent vehicle workflow — existing
- ✓ Return vehicle workflow — existing
- ✓ Vehicle exchange workflow — existing
- ✓ Reservation lookup — existing
- ✓ Car control/fleet management — existing
- ✓ AAO functionality — existing
- ✓ Reports page — existing
- ✓ Settings page — existing
- ✓ PWA support with offline capability — existing

### Active

<!-- Current scope: MFE migration -->

- [ ] Restructure to monorepo with MFE packages in apps/
- [ ] Shell provides auth, routing, UI components, API client
- [ ] Each page becomes independent MFE (9 MFEs total)
- [ ] Event bus for cross-MFE communication
- [ ] Shared type contracts via packages/mfe-types
- [ ] Route-based lazy loading with code splitting
- [ ] Build produces separate bundles per MFE
- [ ] ARCHITECTURE.md documentation at project root

### Out of Scope

- Runtime module federation — build-time integration chosen for simpler ops
- Independent MFE deployment — single artifact deployment preferred
- Server-side rendering — client-side SPA sufficient for internal tool

## Context

**Current state:**
- Monolithic React SPA with TanStack Router file-based routing
- Already has monorepo structure (packages/shared-utils, packages/mfe-types)
- Zustand for auth state, React Query for data fetching
- Radix UI + Tailwind CSS component system
- Vite build tooling

**Pain points driving migration:**
- Team coordination overhead (merge conflicts, stepping on each other)
- Build/deploy speed concerns
- Codebase complexity and coupling

**Target MFE structure:**
```
apps/
  shell/           # Auth, routing, layout, shared infrastructure
  mfe-dashboard/
  mfe-rent/
  mfe-return/
  mfe-vehicle-exchange/
  mfe-reservation-lookup/
  mfe-car-control/
  mfe-aao/
  mfe-reports/
  mfe-settings/
packages/
  mfe-types/       # Shared type contracts
  shared-utils/    # Shared utilities
  ui-components/   # Shared UI component library (extract from shell)
```

## Constraints

- **Tech stack**: React 19, Vite, TypeScript, TanStack Router — existing choices preserved
- **Deployment**: Single artifact — all MFEs compile together
- **Bundle size**: Route-based lazy loading required — minimize initial load
- **Type safety**: All MFE-shell contracts must be typed via packages/mfe-types

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Build-time over runtime federation | Simpler ops, single deployment, no runtime overhead | — Pending |
| Each page = 1 MFE | Clear ownership boundaries, simple mental model | — Pending |
| Event bus for cross-MFE comms | Loose coupling, shell-mediated communication | — Pending |
| Shared types package | Type-safe contracts, compile-time verification | — Pending |

---
*Last updated: 2026-01-22 after initialization*
