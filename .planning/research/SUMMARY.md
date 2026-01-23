# Project Research Summary

**Project:** Car Rental Dashboard - Build-Time Microfrontend Architecture
**Domain:** Build-time microfrontend composition for car rental management
**Researched:** 2026-01-22
**Confidence:** HIGH

## Executive Summary

This is a car rental dashboard requiring migration from monolith to build-time microfrontend architecture with 9 MFEs plus shell. Research confirms build-time composition (single deploy artifact) is the correct approach for coordinated teams, delivering superior performance and simpler deployment compared to runtime Module Federation. The existing stack (React 19, Vite 7, TanStack Router, Zustand, Zod) is already ideal for this architecture—no major replacements needed.

**Recommended approach:** Use pnpm workspaces monorepo with route-based lazy loading via TanStack Router's native code splitting. Add only two dependencies: mitt (200-byte event bus for cross-MFE communication) and vite-tsconfig-paths (clean import paths). Avoid Module Federation plugins entirely—they solve runtime composition, which contradicts the single-artifact requirement. The shell should provide all infrastructure (routing, auth, API client, event bus, UI components), while MFEs remain thin, focused only on domain features.

**Key risks and mitigation:** The biggest danger is choosing wrong domain boundaries (page-level vs business domain), which creates tight coupling and defeats MFE benefits. Second critical risk is unmanaged shared dependencies causing bundle bloat (React duplicated 9 times). Third risk is attempting big bang migration instead of incremental Strangler Fig pattern. Mitigate by: (1) DDD domain analysis before any code, (2) configure Vite manualChunks for shared dependencies upfront, (3) migrate one low-risk MFE in first 2-4 weeks, validate integration, then proceed incrementally.

## Key Findings

### Recommended Stack

Build-time MFE architecture with React 19 requires **avoiding runtime Module Federation entirely**. The ecosystem heavily promotes Module Federation for MFE, but that's for runtime composition with independent deployments—fundamentally different from build-time with single artifact. The correct approach leverages TanStack Router's native lazy loading, pnpm workspaces for monorepo structure, Zod for type-safe contracts, and mitt for cross-MFE events.

**Core technologies:**
- **pnpm workspaces (v9+)**: Monorepo package manager — already have structure, fast with efficient disk usage, workspace protocol enables real-time package updates
- **Vite 7.2.4 (current)**: Build tool with native ESM dev server — already using, perfect for code splitting via dynamic imports
- **TanStack Router 1.146+ (current)**: Type-safe routing with lazy loading — already using, `.lazy.tsx` files create automatic code splitting at MFE boundaries
- **Zod 4.3.5 (current)**: Runtime validation + type inference — already using, perfect for shared contracts between MFEs
- **mitt 3.0.1**: Event emitter for cross-MFE communication — NEW, 200 bytes, type-safe pub/sub pattern prevents tight coupling
- **vite-tsconfig-paths 6.x**: TypeScript path mapping — NEW, enables clean imports like `@shared/ui` instead of `../../../packages/shared-ui`
- **Zustand 5.0.9 (current)**: State management within MFEs — already using, keep for local state, use mitt for cross-MFE

**Critical to NOT use:**
- Module Federation plugins (@originjs/vite-plugin-federation, @module-federation/vite) — these are for runtime composition
- Nx/Turborepo — too small (9 MFEs), revisit only if build times exceed 60 seconds
- Single-SPA — runtime composition framework, not for build-time

**Version currency:** All current dependencies are latest stable versions as of 2026-01-22.

### Expected Features

Build-time microfrontend architectures require clear domain boundaries, type-safe contracts, and coordinated deployment in exchange for simplified deployment and predictable performance.

**Must have (table stakes):**
- Clear domain boundaries (9 bounded contexts via DDD, not arbitrary page splits)
- Type-safe contracts (TypeScript interfaces in shared package, build fails on violations)
- Monorepo workspace management (pnpm workspaces for coordinated builds)
- Shared dependency management (single React version across all MFEs, hoisted deps)
- Bundle splitting & optimization (per-MFE chunks + shared vendor bundle)
- Shell/container application (entry point, routing, auth, shared layout)
- Event bus communication (loosely-coupled pub/sub for cross-MFE messaging)
- Centralized routing (shell owns top-level routes, delegates to MFEs)
- Build pipeline integration (all MFEs build together, single deploy artifact)
- Shared component library (design system for consistency)
- Error boundaries per MFE (failures isolated to one MFE)
- TypeScript throughout (compile-time safety across boundaries)

**Should have (competitive):**
- Incremental build optimization (only rebuild changed MFEs with Turborepo/Nx caching)
- MFE development in isolation (run/test individual MFE without full app)
- Versioned event bus (type-safe event contracts with validation)
- Performance budgets (enforce bundle size limits per MFE)
- Visual regression testing (screenshot diffing per MFE)
- Contract testing (automated verification of MFE compatibility)

**Defer (v2+):**
- Advanced observability (per-MFE instrumentation — add after architecture stabilizes)
- Feature flags per MFE (gradual rollout — defer until needed)
- Shared state management beyond auth/theme (start with event bus, add only if proven necessary)

### Architecture Approach

Build-time microfrontend composition creates single deployable artifact while maintaining development boundaries. Shell acts as orchestrator and service provider, owning routing (TanStack Router), authentication, shared UI components, API client, and event bus. Individual MFEs are "thin"—focused on domain logic, not infrastructure. Each MFE becomes a route subtree with `.lazy.tsx` files that automatically code-split into separate chunks.

**Major components:**
1. **Shell Application** — Provides infrastructure (routing, auth service, UI library, API client, event bus, layout/navigation), no direct dependencies
2. **Shared Packages** — Foundation packages (types, event-bus, api-client, ui) built first, imported by all MFEs
3. **MFE Packages** — Domain-specific features (9 MFEs for rentals, returns, AAO, etc.), depend only on shell services and shared packages
4. **Router (Shell)** — Top-level route definition, lazy loading orchestration via TanStack Router's `createLazyFileRoute`
5. **Event Bus (Shell)** — Cross-MFE communication via mitt pub/sub, type-safe events prevent coupling

**Dependency flow (ONE direction only):**
```
Shell → MFE (allowed)
MFE → Shell services (allowed, read-only)
MFE → MFE (FORBIDDEN - use Event Bus)
```

**Build order:**
```
Phase 1: packages/types → event-bus → api-client → ui (build first, no dependencies)
Phase 2: All 9 MFEs (build in parallel, depend only on shared packages)
Phase 3: apps/shell (build last, imports all MFE entry points)
```

**Data flow:** User navigates → TanStack Router matches route → Router lazy-loads MFE chunk via `.lazy.tsx` → MFE mounts → MFE uses shell UI components, API client, publishes/subscribes to events. Auth managed entirely by shell, MFEs never see tokens.

### Critical Pitfalls

Research identified 12 documented pitfalls from industry case studies. Top 5 critical ones that cause rewrites or failed migrations:

1. **Wrong Domain Boundaries (Page-Level Not Business Domain)** — Splitting by pages instead of business domains creates artificial boundaries causing constant cross-MFE communication. Prevention: Map business domains first using DDD bounded contexts, validate alignment with backend services. Address in Phase 1 (Domain Analysis).

2. **Big Bang Migration Instead of Strangler Fig** — Attempting to migrate all 9 pages simultaneously creates 6-12 month integration nightmare with no production releases. Prevention: Migrate page by page, ship first MFE to production in 2-4 weeks, run old and new in parallel. Address in Phase 2 (Migration Strategy).

3. **Shared State via React Context Across MFEs** — Using React Context for auth/global state across MFEs creates version coupling and breaks when MFEs use different React versions. Prevention: Use event bus for cross-MFE communication, hoist auth to shell as singleton service, pass state via props not context. Address in Phase 3 (Shell Architecture).

4. **Unmanaged Shared Dependencies = Explosive Bundle Size** — Each MFE bundling its own React copy increases bundle 40%+, React loaded 9 times. Prevention: Configure Vite manualChunks for shared vendor bundle, use pnpm workspace hoisting, monitor bundle size in CI. Address in Phase 4 (Build Configuration).

5. **Multiple Router Instances Fighting for Control** — Shell and each MFE both using React Router causes double renders, broken navigation, back button bugs. Prevention: Shell owns global routing, MFEs own local sub-routes, use route-based activation pattern. Address in Phase 3 (Shell Architecture).

**Additional warnings:**
- CSS conflicts without isolation strategy (use CSS Modules)
- No E2E testing for cross-MFE flows (test integration, not just isolation)
- Premature abstraction of shared components (wait for rule of three)
- Build-time coupling creates release train (accept tradeoff or use hybrid)

## Implications for Roadmap

Based on research, build-time MFE architecture requires specific phase ordering to avoid critical pitfalls and leverage dependencies correctly.

### Phase 1: Foundation & Domain Analysis
**Rationale:** Must establish domain boundaries and monorepo structure before any MFE code. Wrong boundaries cause rewrites (Pitfall #1). Build shared packages first as all MFEs depend on them.

**Delivers:**
- DDD bounded context mapping (9 domains identified, validated against backend)
- Monorepo structure with pnpm workspaces
- Shared packages: @packages/types, @packages/event-bus, @packages/api-client, @packages/ui
- TypeScript configuration (base + per-package)

**Addresses:** Clear domain boundaries (table stakes), type-safe contracts (table stakes), monorepo workspace management (table stakes)

**Avoids:** Pitfall #1 (wrong boundaries), Pitfall #4 (unmanaged dependencies by setting up shared packages)

**Research flag:** Standard patterns, skip deeper research

---

### Phase 2: Shell Core
**Rationale:** Shell must exist before any MFE can integrate. Shell provides all infrastructure (routing, auth, API client, event bus). Building shell second establishes the contracts MFEs will consume.

**Delivers:**
- Shell application with Vite + React 19 + TanStack Router
- Auth service (login/logout, token management, interceptors)
- Event bus implementation (mitt with typed events)
- Layout component (header, nav, footer)
- Placeholder routes for future MFEs
- Vite configuration with manualChunks for dependency sharing

**Uses:** All shared packages from Phase 1, TanStack Router (already using), mitt (new dependency)

**Implements:** Shell/container application, centralized routing, event bus communication

**Avoids:** Pitfall #3 (no React Context across MFEs, using event bus), Pitfall #5 (shell owns routing), Pitfall #4 (manualChunks configured upfront)

**Research flag:** Standard patterns, skip deeper research

---

### Phase 3: First MFE (Proof of Concept)
**Rationale:** Validate build-time integration works before building remaining MFEs. Choose lowest-risk, frequently-changed page to stop tech debt accumulation. Strangler Fig pattern starts here.

**Delivers:**
- Single MFE (suggest: Dashboard or low-complexity domain)
- Route with lazy loading via TanStack Router `.lazy.tsx`
- Integration with shell services (auth, API client, event bus, UI components)
- Verified code splitting (separate chunk in build output)
- CI/CD pipeline for single MFE deployment

**Addresses:** Strangler Fig migration (not big bang), MFE development patterns

**Avoids:** Pitfall #2 (big bang migration by shipping one MFE first)

**Research flag:** May need phase research for chosen domain specifics (car rental business logic)

---

### Phase 4: Second & Third MFEs
**Rationale:** Validate cross-MFE patterns (event communication, shared components, CSS isolation) with 2-3 MFEs before scaling to all 9. Identify integration issues early.

**Delivers:**
- 2 additional MFEs integrated with shell
- Cross-MFE event bus communication working
- CSS isolation strategy implemented (CSS Modules recommended)
- E2E tests for cross-MFE user flows
- Bundle size monitoring in CI

**Addresses:** Event bus communication (table stakes), shared component library patterns, error boundaries per MFE

**Avoids:** Pitfall #6 (CSS conflicts by implementing isolation early), Pitfall #7 (no E2E tests by adding integration suite now)

**Research flag:** May need deeper research for complex cross-MFE interactions specific to car rental domain

---

### Phase 5: Remaining MFEs (Parallel Development)
**Rationale:** With patterns proven, remaining 6 MFEs can be built in parallel by teams. Use first 3 MFEs as templates.

**Delivers:**
- All 9 MFEs integrated into shell
- Full feature parity with original monolith
- Complete E2E test coverage for critical user journeys

**Addresses:** Complete domain coverage, all table stakes features implemented

**Avoids:** Pitfall #8 (premature abstraction by waiting to see patterns across multiple MFEs)

**Research flag:** Standard patterns established by Phase 4, skip deeper research

---

### Phase 6: Optimization & Production Hardening
**Rationale:** With all MFEs working, optimize bundle size, add monitoring, implement nice-to-have features.

**Delivers:**
- Bundle optimization (vendor chunks, shared chunks, per-MFE chunks)
- Performance budgets enforced in CI
- Error boundaries per MFE with fallback UI
- Loading states for lazy routes
- Version metadata in production builds
- Incremental build optimization (Turborepo/Nx if needed)

**Addresses:** Bundle splitting & optimization (table stakes), performance budgets (competitive), incremental builds (competitive)

**Avoids:** Pitfall #12 (no version visibility by adding metadata)

**Research flag:** Standard optimization patterns, skip deeper research

---

### Phase Ordering Rationale

- **Foundation first (Phase 1):** Shared packages are dependencies for everything else. Domain boundaries must be correct before code, as wrong boundaries require rewrites.
- **Shell second (Phase 2):** MFEs consume shell services, so shell contracts must exist first. Auth and routing complexity concentrated here.
- **Incremental MFE migration (Phases 3-5):** Strangler Fig pattern validates integration early, ships value incrementally, reduces risk vs big bang.
- **Optimization last (Phase 6):** Premature optimization wastes effort. Patterns must stabilize before extracting shared components or optimizing bundles.

**Dependency-driven order:**
```
Shared packages → Shell → First MFE → Integration patterns → Remaining MFEs → Optimization
```

**Risk-driven order:**
```
Domain analysis (mitigate Pitfall #1) → Shell architecture (mitigate #3, #5) → Build config (mitigate #4) → First MFE (mitigate #2) → CSS isolation (mitigate #6) → E2E tests (mitigate #7)
```

### Research Flags

**Phases likely needing deeper research during planning:**
- **Phase 3:** First MFE domain specifics — car rental business logic, backend API contracts, data models may need domain research if documentation sparse
- **Phase 4:** Complex cross-MFE interactions — if rental flow spans multiple MFEs (search → reserve → checkout), may need workflow research

**Phases with standard patterns (skip research-phase):**
- **Phase 1:** Monorepo setup, pnpm workspaces — well-documented, established patterns
- **Phase 2:** Shell with TanStack Router — official docs sufficient, already using router
- **Phase 5:** Remaining MFEs — templates established by Phase 3-4, duplicate patterns
- **Phase 6:** Bundle optimization — standard Vite configuration, extensive docs

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All recommended technologies verified current, official docs confirm patterns, already using most of stack |
| Features | HIGH | Build-time MFE table stakes well-documented across multiple authoritative sources, feature priority clear |
| Architecture | HIGH | Build-time composition patterns proven, TanStack Router lazy loading verified from official docs, clear component boundaries |
| Pitfalls | HIGH | 12 pitfalls cross-referenced across industry case studies, prevention strategies validated, phase-specific warnings mapped |

**Overall confidence:** HIGH

Research benefits from extensive industry case studies (2024-2026), official documentation for all core technologies, and clear consensus on build-time vs runtime tradeoffs. The existing stack is already 90% correct—only 2 new dependencies needed.

### Gaps to Address

**Gaps identified during research:**

1. **Car rental domain specifics** — Research covered generic MFE patterns, not car rental business logic. May need domain research during Phase 3 for: reservation workflows, fleet management data models, customer interaction patterns.
   - **Handle by:** Validate backend API contracts before Phase 3, consider `/gsd:research-phase` for first MFE domain

2. **Current monolith structure unknown** — Research assumes monolith exists but doesn't know current routing, state management, or page boundaries.
   - **Handle by:** Audit current codebase during Phase 1 to map existing pages to proposed 9 MFEs, validate domain boundaries match current structure

3. **Team structure and ownership** — Build-time MFE success depends on coordinated teams. Unknown if 9 MFEs map to existing teams.
   - **Handle by:** Define team ownership matrix during Phase 1, may need to adjust MFE boundaries to match team structure

4. **Backend service boundaries** — Frontend MFE boundaries should align with backend microservices (if they exist). Unknown if backend is monolith or services.
   - **Handle by:** Validate with backend team during Phase 1 domain analysis, adjust MFE boundaries to match backend

5. **Vite manualChunks specifics** — General pattern known, but exact configuration depends on actual dependencies and bundle analysis.
   - **Handle by:** Analyze bundle after Phase 2 shell build, tune manualChunks based on actual shared dependencies

**No research gaps block starting Phase 1.** Remaining gaps resolve during implementation.

## Sources

### Primary (HIGH confidence)
- TanStack Router official docs — Code splitting patterns, `createLazyFileRoute` API
- pnpm workspaces official docs — Monorepo configuration, workspace protocol
- Vite official docs — Build configuration, manualChunks pattern
- Zod official docs — Schema validation, TypeScript inference
- mitt GitHub repository — Event bus implementation, TypeScript support
- Domain-Driven Design in micro-frontend architecture — Bounded context mapping
- Strangler Fig Pattern — Incremental migration strategy
- Module Federation official docs — Confirmed NOT needed for build-time

### Secondary (MEDIUM confidence)
- Martin Fowler: Micro Frontends — Architecture patterns and principles
- Build-Time vs Runtime Integration (multiple sources) — Syncfusion, Bits and Pieces, Medium articles
- Ways to minimize Microfrontend bundle sizes — Mashroom Server blog
- Routing Challenges in Micro Frontends — Medium case studies
- Testing Strategies for Micro Frontends — LambdaTest, TestRigor blogs
- Top 10 Micro Frontend Anti-Patterns — Dev.to, InfoQ presentations
- AWS Prescriptive Guidance: Understanding microfrontends — Implementation patterns

### Tertiary (LOW confidence)
- Various Medium articles on specific implementation details — needs validation during implementation
- ArXiv research paper: Catalog of Micro Frontends Anti-patterns (2024) — academic, less practical

---
*Research completed: 2026-01-22*
*Ready for roadmap: yes*
