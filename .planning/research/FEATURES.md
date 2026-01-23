# Feature Landscape: Build-Time Microfrontend Architecture

**Domain:** Build-time microfrontend integration for car rental dashboard
**Researched:** 2026-01-22
**Confidence:** HIGH

## Executive Summary

Build-time microfrontend architectures compose independent applications during the build process, producing a single optimized bundle. For a 9-page car rental dashboard with shell, table stakes include clear domain boundaries, type-safe contracts, bundle optimization, and coordinated deployment. Differentiators include advanced observability, sophisticated error isolation, and developer experience tooling. Anti-features center on runtime complexity, excessive fragmentation, and tight coupling patterns.

---

## Table Stakes

Features users/teams expect. Missing these means the architecture fails to deliver core microfrontend benefits.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Clear Domain Boundaries** | Core principle of MFE - each MFE owns a business domain end-to-end | Medium | Requires DDD analysis; 9 pages = 9 bounded contexts. Misalignment causes cross-team dependencies. |
| **Team Ownership Model** | Teams need full vertical ownership (UI + logic + deployment) for autonomy | Low | Organizational, not technical. Define ownership matrix: team → MFE → domain. |
| **Type-Safe Contracts** | Shared interfaces between MFEs must be type-checked at compile time | Medium | TypeScript interfaces in shared package. Build fails on contract violations. Critical for build-time safety. |
| **Monorepo Workspace Management** | Build-time MFEs typically live in monorepo for coordinated builds | Medium | Nx/Turborepo/pnpm workspaces required. Dependency graph, build orchestration, incremental builds. |
| **Shared Dependency Management** | React, common libraries must be deduplicated to avoid bundle bloat | High | Single version of React across all MFEs. Workspace hoisting or shared externals config. Version conflicts painful. |
| **Bundle Splitting & Optimization** | Build output must split code efficiently (per-MFE chunks + shared chunks) | High | Webpack configuration for splitChunks, tree-shaking. Goal: shared vendor bundle + per-MFE bundles. |
| **Shell/Container Application** | Entry point that loads MFEs, provides routing, shared layout | Medium | Orchestrates MFE lifecycle. Centralized routing or route delegation. Provides header, nav, footer. |
| **Event Bus Communication** | Loosely-coupled pub/sub for inter-MFE messaging | Medium | Publish/subscribe pattern. Single shared instance. Prevents tight coupling. TypeScript event types. |
| **Centralized Routing** | Single routing mechanism that delegates to appropriate MFE | Medium | Shell owns top-level routes, delegates subroutes. React Router integration. Deep linking support. |
| **Build Pipeline Integration** | All MFEs build together in coordinated CI/CD | Medium | Single build command produces complete bundle. Build cache for unchanged MFEs. Deploy entire bundle atomically. |
| **Shared Component Library** | Common UI components (buttons, forms, tables) for consistency | Low-Medium | Design system as npm package. Only UI logic, no business logic. Web Components for framework agnosticism. |
| **Error Boundaries per MFE** | Failures in one MFE shouldn't crash others | Low | React Error Boundary around each MFE mount point. Fallback UI. Isolates errors locally. |
| **TypeScript Throughout** | Compile-time safety across MFE boundaries | Low | Required for contract enforcement. tsconfig per MFE + shared base config. |

---

## Differentiators

Features that enhance the architecture beyond basics. Not strictly required, but provide competitive advantage.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Contract Testing** | Automated verification that MFE contracts remain compatible | High | Pact or similar. Consumer-driven contracts. Catches breaking changes before integration. Build-time verification. |
| **Advanced Observability** | Real User Monitoring, error tracking, performance metrics per MFE | Medium-High | Grafana/Datadog/New Relic integration. Per-MFE instrumentation with isolate flag. Traces errors to specific MFE. |
| **Incremental Build Optimization** | Only rebuild changed MFEs and dependents | Medium | Nx affected commands, Turborepo caching. Speeds up CI dramatically. Dependency graph analysis. |
| **MFE Development in Isolation** | Run/test individual MFE without full app | Medium | Mock shell, stub event bus. Faster feedback loop. Requires good abstractions. |
| **Versioned Event Bus** | Type-safe, versioned event contracts with validation | High | Event schema versioning. Runtime validation. Prevents event contract drift. TypeScript codegen. |
| **Automated Dependency Updates** | Renovate/Dependabot for coordinated updates | Low-Medium | Monorepo-aware. Updates shared deps across all MFEs. Reduces version drift. |
| **Visual Regression Testing** | Screenshot diffing to catch UI changes | Medium | Percy, Chromatic, or Playwright. Per-MFE snapshots. Prevents unintended changes. |
| **Performance Budgets** | Enforce bundle size limits per MFE | Low | Webpack bundle analyzer + CI checks. Fails build if MFE exceeds size. Prevents bloat. |
| **Feature Flags per MFE** | Toggle features independently within MFEs | Medium | LaunchDarkly, Unleash, or custom. Enables gradual rollout, A/B testing. |
| **Shared State Management** | Optional centralized state for cross-MFE concerns | Medium | Redux/Zustand for auth, user context. Avoid overuse - prefer events. |
| **Hot Module Replacement** | Dev server updates individual MFE without full reload | Low-Medium | Webpack HMR config per MFE. Faster dev experience. |
| **MFE Health Checks** | Runtime verification that all MFEs loaded successfully | Low | Check MFE mount points after load. Log failures. Graceful degradation. |
| **Documentation Site** | Auto-generated docs for MFE APIs, events, contracts | Medium | Storybook for components, TypeDoc for APIs. Living documentation. |

---

## Anti-Features

Features to deliberately NOT implement. Common mistakes in microfrontend domain.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Hidden Monolith** | All MFEs interdependent, can't build separately | Enforce build independence. Each MFE should build in isolation. Use contract tests to verify. |
| **Micro-Everything** | 50+ tiny MFEs, excessive fragmentation | Limit to business domains. For 9 pages, 9 MFEs is reasonable. Don't split further unless teams justify. |
| **Shared Business Logic Libraries** | Creates tight coupling, defeats autonomy | Duplicate code initially. Extract only when 3+ teams need identical logic. Keep shared libs to UI only. |
| **Framework Madness** | Multiple frameworks (React + Vue + Angular) | Standardize on React. Build-time integration already chosen - multiple frameworks add complexity for no gain. |
| **Runtime Federation** | Module Federation, dynamic imports | Already committed to build-time. Don't mix paradigms. Stick with static composition. |
| **Chatty Frontends** | Excessive event emissions, complex event chains | Limit events to cross-domain concerns. Use props for parent-child. Event bus is for siblings only. |
| **Shared State for Everything** | Central Redux store with all MFE state | Each MFE owns its state. Share only auth, user context, theme. Prefer events over shared state. |
| **Distributed Data Inconsistency** | Same data replicated across MFEs with sync issues | Single source of truth. One MFE owns data, others request via events or API. Clear ownership. |
| **Violating Single Responsibility** | One MFE handling multiple unrelated domains | Each MFE = one bounded context. If MFE has multiple "reasons to change," split it. |
| **Tight Coupling via Direct Imports** | MFE A imports components/functions from MFE B | Only shared library imports allowed. MFEs communicate via events or props from shell. |
| **No Error Boundaries** | One MFE crash takes down entire app | Wrap each MFE in Error Boundary. User sees fallback for broken MFE, rest works. |
| **Ignoring Observability** | Can't trace errors to specific MFE | Instrument from day one. Per-MFE error tracking. Future debugging nightmare otherwise. |
| **Independent Versioning** | Each MFE on different React version | Build-time = single React version for all. Shared dependencies hoisted. Version unity required. |
| **Over-Engineering Deployment** | Complex CD with per-MFE deployments | Build-time = single bundle, single deployment. Embrace simplicity. Don't retrofit runtime patterns. |

---

## Feature Dependencies

```
Build-Time Foundation
├── Monorepo Workspace Management (required for everything)
│   ├── Shared Dependency Management (must deduplicate)
│   │   ├── Bundle Splitting & Optimization (requires shared deps)
│   │   └── Performance Budgets (monitors bundle output)
│   ├── Build Pipeline Integration (coordinates builds)
│   │   ├── Incremental Build Optimization (speeds pipeline)
│   │   └── Contract Testing (runs in pipeline)
│   └── TypeScript Throughout (enables type safety)
│       └── Type-Safe Contracts (uses TS interfaces)
│
Domain Architecture
├── Clear Domain Boundaries (DDD analysis first)
│   ├── Team Ownership Model (maps teams to boundaries)
│   └── Shell/Container Application (orchestrates domains)
│       ├── Centralized Routing (shell delegates routes)
│       └── Error Boundaries per MFE (shell wraps MFEs)
│
Communication Layer
├── Event Bus Communication (pub/sub)
│   ├── Versioned Event Bus (optional enhancement)
│   └── TypeScript Throughout (type-safe events)
│
Developer Experience
├── MFE Development in Isolation (enables fast feedback)
├── Hot Module Replacement (improves dev speed)
└── Documentation Site (documents contracts)

Observability Layer (optional but recommended)
├── Advanced Observability (per-MFE instrumentation)
├── MFE Health Checks (runtime verification)
└── Visual Regression Testing (prevents regressions)
```

---

## MVP Recommendation

For initial build-time MFE implementation, prioritize:

### Phase 1: Foundation (Must Have)
1. **Monorepo Workspace Management** - Nx or Turborepo setup
2. **TypeScript Throughout** - tsconfig per MFE + shared base
3. **Shared Dependency Management** - Single React version, hoisted deps
4. **Shell/Container Application** - Entry point with basic routing
5. **Clear Domain Boundaries** - Map 9 pages to 9 bounded contexts
6. **Team Ownership Model** - Assign ownership matrix

### Phase 2: Integration (Must Have)
7. **Type-Safe Contracts** - Shared interfaces package
8. **Event Bus Communication** - Simple pub/sub implementation
9. **Centralized Routing** - Shell owns routes, delegates to MFEs
10. **Error Boundaries per MFE** - Wrap each MFE mount point
11. **Build Pipeline Integration** - Single build command, CI/CD
12. **Bundle Splitting & Optimization** - Webpack config for shared chunks

### Phase 3: Enhancement (Should Have)
13. **Shared Component Library** - Common UI components
14. **Incremental Build Optimization** - Nx affected commands
15. **Performance Budgets** - Enforce bundle size limits
16. **Contract Testing** - Pact or similar for contract verification

### Defer to Post-MVP:
- **Advanced Observability**: Can add Datadog/Grafana after architecture stabilizes
- **Versioned Event Bus**: Start with simple event bus, version later if needed
- **MFE Development in Isolation**: Nice-to-have, but full-app dev works initially
- **Visual Regression Testing**: Add once UI patterns stabilize
- **Feature Flags per MFE**: Defer until gradual rollout needs emerge

---

## Build-Time Specific Considerations

### What Build-Time Enables:
- **Optimized Performance**: Single bundle, aggressive code splitting, tree-shaking
- **Simplified Deployment**: One artifact, atomic deploys, no version drift
- **Type Safety Guarantees**: All contracts verified at compile time
- **Smaller Runtime**: No module loader, no dynamic resolution overhead

### Build-Time Limitations:
- **Coordinated Releases**: All MFEs deploy together, can't independently release
- **Rebuild on Any Change**: Any MFE change triggers full build (mitigate with incremental builds)
- **Version Unity Required**: All MFEs must use same framework version
- **Tight Development Coupling**: Teams must coordinate on shared dependency updates

### Build-Time vs Runtime Trade-off:
Build-time chosen for:
- **Better Performance**: Car rental dashboard likely needs fast load times
- **Simpler Deployment**: Single bundle easier to manage than federated modules
- **Type Safety**: Contracts enforced at build time, not discovered at runtime
- **Team Coordination**: 9 MFEs manageable with coordinated builds (not 50+)

Sacrifices:
- **Independent Deployment**: Can't deploy one MFE without full build
- **Runtime Flexibility**: Can't A/B test MFE versions or roll back individually

---

## Complexity Assessment

| Feature Category | Overall Complexity | Key Challenges |
|------------------|-------------------|----------------|
| Workspace Setup | Medium | Monorepo tooling (Nx/Turborepo), workspace config, dependency hoisting |
| Type Safety | Low-Medium | TypeScript config, shared interfaces, strict mode enforcement |
| Communication | Medium | Event bus design, avoiding chattiness, typed events |
| Build Pipeline | High | Webpack config, shared chunks, incremental builds, CI orchestration |
| Domain Boundaries | Medium | Requires DDD analysis, may reveal org misalignment |
| Observability | Medium-High | Per-MFE instrumentation, error tracking, performance monitoring |
| Testing | High | Contract testing, integration testing, visual regression |

---

## Sources

**Build-Time Integration:**
- [Micro Frontend: Run-Time Vs. Build-Time Integration](https://www.syncfusion.com/blogs/post/micro-frontend-run-time-vs-build-time)
- [Build-Time vs Runtime Integration](https://engrmuhammadusman108.medium.com/microfrontend-build-time-intergation-vs-run-time-integration-concepts-cc56bddfbc85)
- [The Case for Build-Time Micro Frontends](https://dev.to/msm8/the-case-for-build-time-micro-frontends-2a6f)

**Architecture & Best Practices:**
- [Micro Frontend Architecture: Complete Guide 2026](https://thinksys.com/development/micro-frontend-architecture/)
- [Micro Frontend Architecture: A Full 2026 Guide](https://elitex.systems/blog/micro-frontend-architecture-a-full-guide-elitex)
- [Martin Fowler: Micro Frontends](https://martinfowler.com/articles/micro-frontends.html)
- [Complete Micro Frontend Architecture Guide 2025](https://www.altersquare.io/micro-frontend-guide/)

**Type Safety & Contracts:**
- [Micro Frontend Architecture and Best Practices](https://www.xenonstack.com/insights/micro-frontend-architecture)
- [Contract Testing MicroFrontends](https://donkeycoder.medium.com/contract-testing-microfrontends-d35ef36bda1b)
- [AWS: Understanding and implementing microfrontends](https://docs.aws.amazon.com/pdfs/prescriptive-guidance/latest/micro-frontends-aws/micro-frontends-aws.pdf)

**Communication Patterns:**
- [Microfrontend Best Practices: Communication Patterns](https://medium.com/@anasstissirallah/microfrontend-best-practices-and-design-patterns-part-2-8455357b27a8)
- [How to Create an Event Bus for Micro Frontend](https://oskari.io/blog/event-bus-micro-frontend)
- [5 Cross Micro Frontend Communication Techniques](https://sharvishi9118.medium.com/cross-micro-frontend-communication-techniques-a10fedc11c59)
- [Event-Driven Architecture](https://microfrontend.dev/architecture/event-driven-architecture/)

**Monorepo & Workspace Management:**
- [Micro Frontends with Module Federation in Monorepo](https://michalzalecki.com/micro-frontends-module-federation-monorepo/)
- [Microfrontends in the Monorepo](https://javascript-conference.com/blog/microfrontends-in-the-monorepo/)
- [Monorepos, Micro-Frontends, and Vite](https://dev.to/hxnain619/monorepo-and-micro-frontends-using-module-federation-vite-1e47)
- [Ultimate Guide to Building a Monorepo in 2026](https://medium.com/@sanjaytomar717/the-ultimate-guide-to-building-a-monorepo-in-2025-sharing-code-like-the-pros-ee4d6d56abaa)

**Bundle Optimization:**
- [Micro-frontend and shared dependencies](https://microfrontend.dev/architecture/frontend-shared-dependencies/)
- [Ways to minimize Microfrontend bundle sizes](https://medium.com/mashroom-server/ways-to-minimize-microfrontend-bundle-sizes-876b2bbc115b)
- [Solving micro-frontend challenges with Module Federation](https://blog.logrocket.com/solving-micro-frontend-challenges-module-federation/)

**Routing & Shell Architecture:**
- [Handling Routing in Microfrontend Architecture](https://article.arunangshudas.com/handling-routing-in-a-microfrontend-architecture-71472a3ec3d6)
- [Micro-frontends, url design and routing](https://microfrontend.dev/user-experience/micro-frontends-routing/)
- [Micro Frontend Architecture | Nx](https://nx.dev/docs/technologies/module-federation/concepts/micro-frontend-architecture)

**Anti-Patterns:**
- [Top 10 Micro Frontend Anti-Patterns](https://dev.to/florianrappl/top-10-micro-frontend-anti-patterns-3809)
- [Microfrontends Anti-Patterns: Seven Years in the Trenches](https://www.infoq.com/presentations/microfrontend-antipattern/)
- [A Catalog of Micro Frontends Anti-patterns](https://arxiv.org/html/2411.19472v1)
- [4 Micro-Frontend Anti-Patterns](https://levelup.gitconnected.com/four-micro-frontend-anti-patterns-58aaa9fe19d5)

**Testing:**
- [How to Test Microfrontends: A Comprehensive Guide](https://article.arunangshudas.com/how-to-test-microfrontends-a-comprehensive-guide-02cec94036ca)
- [Micro-frontends Automated Testing](https://testrigor.com/blog/micro-frontends-automated-testing/)
- [Testing Strategies for Micro Frontends](https://www.lambdatest.com/blog/micro-frontends-testing-strategies/)
- [Testing in 2026: Jest, React Testing Library](https://www.nucamp.co/blog/testing-in-2026-jest-react-testing-library-and-full-stack-testing-strategies)

**Versioning & Deployment:**
- [Handling Versioning in Microfrontend Setup](https://article.arunangshudas.com/handling-versioning-in-a-microfrontend-setup-27e7902b6f51)
- [Versioning and Backward Compatibility](https://eajournals.org/wp-content/uploads/sites/21/2025/05/Versioning.pdf)

**Team Ownership & Domain Boundaries:**
- [Domain-Driven Design in micro-frontend architecture](https://thesametech.com/domain-driven-design-in-micro-frontend-architecture/)
- [AWS: Identifying micro-frontend boundaries](https://docs.aws.amazon.com/prescriptive-guidance/latest/micro-frontends-aws/micro-frontend-boundaries.html)
- [Micro-Frontends: Sociotechnical Journey](https://www.infoq.com/articles/adopt-micro-frontends/)

**Shared Components & Design Systems:**
- [Micro Frontends in 2025 & Design Systems](https://dev.to/artur_sopelnik_fe02383a86/micro-frontends-in-2025-design-systems-the-ultimate-guide-4hn4)
- [Sharing components Micro Frontends](https://dev.to/ricardo_maia_eb9c7a906560/sharing-components-micro-frontends-2p61)
- [Micro Frontends and Design Systems](https://dev.to/dhrumitdk/micro-frontends-and-design-systems-how-to-achieve-cohesion-across-teams-59gi)

**Error Handling:**
- [Error Boundaries in Micro-frontend Architecture](https://medium.com/@siddhesh.shirdhankar18/error-boundaries-in-micro-frontend-architecture-5b5dd2c71541)
- [Micro-frontends error handling with React Error Boundary](https://gist.github.com/leocristofani/adbe9a9dfc66e000e028d6f4ba31f213)

**Observability & Monitoring:**
- [Grafana Cloud Frontend Observability](https://grafana.com/docs/grafana-cloud/monitor-applications/frontend-observability/)
- [Instrument composable frontends](https://grafana.com/docs/grafana-cloud/monitor-applications/frontend-observability/instrument/composable-frontends/)
- [Observability in Angular Micro Frontend](https://medium.com/@guilherme.jimenessz/practical-example-of-observability-in-angular-micro-frontend-implementation-using-datadog-and-8e3e46a878fc)
- [15 Best Observability Tools in DevOps for 2026](https://spacelift.io/blog/observability-tools)

**Developer Experience:**
- [Micro Frontend Architecture: A Full 2026 Guide](https://elitex.systems/blog/micro-frontend-architecture-a-full-guide-elitex)
- [Frontend Development Trends 2026](https://www.syncfusion.com/blogs/post/frontend-development-trends)
