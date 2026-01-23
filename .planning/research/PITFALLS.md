# Domain Pitfalls: Build-Time Microfrontend Migration

**Domain:** Car rental dashboard migrating to MFE architecture
**Migration Type:** Monolith to build-time MFE (9 page-level MFEs + shell)
**Researched:** 2026-01-22
**Confidence:** HIGH (based on extensive industry case studies and documented anti-patterns)

---

## Critical Pitfalls

Mistakes that cause rewrites, failed migrations, or major architectural issues.

### Pitfall 1: Wrong Domain Boundaries (Page-Level Not Business Domain)

**What goes wrong:**
Splitting by pages instead of business domains creates artificial boundaries that don't align with team ownership or backend services. A "Reservations" page might need to coordinate with "Customer Profile" page for basic operations, causing tight coupling despite the MFE split.

**Why it happens:**
Teams choose page-level MFEs for simplicity without analyzing actual domain boundaries. "9 pages = 9 MFEs" sounds clean but ignores that multiple pages often serve the same business domain.

**Consequences:**
- Constant cross-MFE communication for simple features
- Changes in one MFE force changes in 3-4 others
- Team boundaries blur because domains leak across MFEs
- Build-time integration forces full rebuilds for domain changes

**Detection:**
- If adding a feature to MFE A always requires changes to MFE B, boundaries are wrong
- If the shell needs changes every time an MFE is updated, domain is leaking
- If multiple MFEs share the same data models, you split too granularly

**Prevention:**
1. Map business domains first, pages second
2. Use Domain-Driven Design bounded contexts (e.g., "Rentals", "Customers", "Fleet Management")
3. Create dependency heatmap: if two MFEs change together 70%+ of the time, merge them
4. Validate that frontend boundaries align with backend service boundaries
5. Each MFE should correspond to a vertical slice (UI → API → DB)

**Phase to address:** Phase 1 (Domain Analysis) - Get this wrong and everything else fails

**Source confidence:** HIGH - [Domain-Driven Design in micro-frontend architecture](https://thesametech.com/domain-driven-design-in-micro-frontend-architecture/), [Identifying micro-frontends in our applications](https://medium.com/dazn-tech/identifying-micro-frontends-in-our-applications-4b4995f39257)

---

### Pitfall 2: Big Bang Migration Instead of Strangler Fig

**What goes wrong:**
Attempting to migrate all 9 pages simultaneously creates a months-long integration nightmare where nothing ships to production, teams are blocked on each other, and the old monolith keeps accumulating tech debt.

**Why it happens:**
Build-time integration creates the illusion that "we need everything ready to ship together." Teams think incremental is too complex or want a clean cut.

**Consequences:**
- 6-12 month migration with no production releases
- Integration issues discovered late when all MFEs come together
- Old monolith continues to rot while migration drags
- Team morale crashes as no visible progress for months
- High risk single deployment instead of gradual rollout

**Detection:**
- Migration plan shows single "go live" date months in the future
- No intermediate production releases planned
- All 9 MFEs being built in parallel before any ship
- Teams blocked waiting for other teams to finish
- QA can't test until everything is done

**Prevention:**
1. Use Strangler Fig pattern: migrate page by page
2. Start with lowest-risk, highest-value page (likely not the homepage)
3. Ship first MFE to production in 2-4 weeks, not months
4. Run old and new systems in parallel during transition
5. Route by URL pattern: `/reservations/*` → new MFE, others → monolith
6. Migrate related pages in batches to maintain UX coherence
7. Target frequently-changed pages early to stop tech debt accumulation

**Phase to address:** Phase 2 (Migration Strategy) - Define incremental approach before writing code

**Source confidence:** HIGH - [Incremental Migrations with Microfrontends](https://vercel.com/kb/guide/incremental-migrations-with-microfrontends), [Strangler Fig Pattern](https://www.leanderhoedt.dev/blog/strangler-fig), [Why all application migrations should be incremental](https://vercel.com/blog/incremental-migrations)

---

### Pitfall 3: Shared State via React Context Across MFEs

**What goes wrong:**
Using React Context to share authentication, user preferences, or global state across MFEs creates version coupling and breaks independent deployability. When MFE A uses React 18.2 and MFE B uses React 18.3, context breaks silently.

**Why it happens:**
React Context is the familiar pattern from monoliths, so teams extend it to MFEs without understanding that build-time integration doesn't guarantee shared React instances.

**Consequences:**
- Authentication breaks when MFEs use different React versions
- State becomes desynchronized across MFEs
- Multiple provider instances create independent state trees
- Tight coupling eliminates deployment independence
- Debugging is nightmare: "it works in dev, breaks in prod"

**Detection:**
- Multiple versions of React in build output
- Different MFEs wrapping root with same Context.Provider
- Authentication or theme state inconsistent across pages
- Bundle analysis shows React duplicated across chunks
- Integration tests pass, E2E tests fail mysteriously

**Prevention:**
1. **DON'T share state via React Context across MFEs** - this is an anti-pattern
2. Use event bus for cross-MFE communication (you chose this already, good!)
3. For truly shared state (auth, theme), hoist to shell as singleton service
4. Configure Module Federation to share React as singleton (if using runtime)
5. For build-time: pass state via props from shell, not context
6. Use URL state for navigation-related data (query params, route state)
7. Accept some duplication rather than forcing sharing

**Pattern for your event bus approach:**
```javascript
// Shell provides event bus as window global or injected service
// MFE A: publish event
eventBus.publish('user.authenticated', { userId, token });

// MFE B: subscribe to event
eventBus.subscribe('user.authenticated', ({ userId, token }) => {
  updateLocalState(userId, token);
});
```

**Phase to address:** Phase 3 (Shell Architecture) - Define communication contracts before building MFEs

**Source confidence:** HIGH - [Shared Context in a Micro Frontends Architecture](https://medium.com/pecan-ai/shared-context-in-a-micro-frontends-architecture-75d7fbc8925c), [Understanding the Multiple Instance Problem in Micro Frontends](https://theplainscript.medium.com/understanding-the-multiple-instance-problem-in-micro-frontends-and-how-to-address-it-9519402d4362), [React context between microfrontends](https://www.developerload.com/react-context-between-microfrontends)

---

### Pitfall 4: Unmanaged Shared Dependencies = Explosive Bundle Size

**What goes wrong:**
Without explicit dependency sharing strategy, each MFE bundles its own copy of React, React Router, date libraries, UI components. Bundle size explodes from 7.5MB to 10.5MB+ with duplicated code shipped to users.

**Why it happens:**
Build-time integration creates separate bundles per MFE. Without Module Federation or explicit externals configuration, bundlers include everything needed per MFE.

**Consequences:**
- Bundle size increases 40%+ compared to monolith
- Initial page load 2-3x slower
- React loaded 9 times (once per MFE)
- Shared UI library duplicated in every MFE
- Users download megabytes of duplicate code
- Performance regression kills MFE value proposition

**Detection:**
- Bundle analysis shows React in multiple chunks
- Total bundle size > 1.5x original monolith
- Same library (react-router, date-fns) appears 5+ times
- Lighthouse performance score drops after migration
- webpack-bundle-analyzer shows massive duplication

**Prevention:**
1. Use Module Federation with shared dependencies config
2. Define shared dependencies in shell:
   ```javascript
   shared: {
     react: { singleton: true, requiredVersion: '^18.0.0' },
     'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
     'react-router-dom': { singleton: true }
   }
   ```
3. Extract common UI components to shared library
4. Use webpack externals for build-time approach
5. Monitor bundle size in CI (fail if >10% increase)
6. Target shared bundle size of 200-300KB (not counting vendor libs)
7. Accept strategic duplication for small libraries (<10KB)

**For your build-time setup:**
- Create shared npm workspace package for common code
- Use webpack externals to mark React/Router as external
- Shell provides shared deps via global or window
- Each MFE consumes from external, doesn't bundle

**Phase to address:** Phase 4 (Build Configuration) - Set up before first MFE to avoid refactoring

**Source confidence:** HIGH - [Ways to minimise Microfrontend bundle sizes](https://medium.com/mashroom-server/ways-to-minimize-microfrontend-bundle-sizes-876b2bbc115b), [Mastering Microfrontends: Sharing Dependencies Across Apps](https://medium.com/ama-tech-blog/mastering-microfrontends-sharing-dependencies-across-apps-e3811b650d7), [Module Federation docs](https://webpack.js.org/concepts/module-federation/)

---

### Pitfall 5: Multiple Router Instances Fighting for Control

**What goes wrong:**
Shell uses React Router for top-level navigation, each MFE also uses React Router internally. Both listen to `window.history`, causing double renders, broken navigation, and "back button doesn't work" bugs.

**Why it happens:**
Teams naturally use React Router in both shell and MFEs without coordinating who owns which routes. Each router instance thinks it's in charge.

**Consequences:**
- Clicking link in MFE triggers both shell and MFE routers
- Back button navigates two levels instead of one
- Deep links broken: `/reservations/123` loads wrong view
- Route changes in MFE don't update shell breadcrumbs
- Different routers use different routing modes (hash vs browser)

**Detection:**
- Console shows multiple router warnings
- Back button behaves inconsistently
- URL changes but view doesn't update (or vice versa)
- Deep linking works in dev, breaks in integrated build
- Route-based code splitting fails to load correct chunk

**Prevention:**
1. **Shell owns global routing**, MFEs own local routing
2. Use route-based activation: shell routes `/reservations/*` to ReservationsMFE
3. MFE routers should be relative to their mount path:
   ```javascript
   // Shell routes
   <Route path="/reservations/*" element={<ReservationsMFE />} />

   // Inside ReservationsMFE
   <Routes>
     <Route path="/" element={<List />} />
     <Route path=":id" element={<Details />} />
   </Routes>
   ```
4. Use single Router instance in shell, MFEs use nested Routes
5. Shell passes basename to MFE: `<ReservationsMFE basename="/reservations" />`
6. For cross-MFE navigation, use event bus or shell's navigate function
7. Document route ownership in shared registry

**Phase to address:** Phase 3 (Shell Architecture) - Define routing strategy before MFE development

**Source confidence:** HIGH - [Routing Challenges in Micro Frontends](https://medium.com/@vasanthancomrads/routing-challenges-in-micro-frontends-and-how-to-solve-them-9ed6da536800), [Mastering Microfrontends: Routing and Communication](https://medium.com/ama-tech-blog/mastering-microfrontends-routing-and-communication-815f3a7b7910), [Handling Routing in a Microfrontend Architecture](https://article.arunangshudas.com/handling-routing-in-a-microfrontend-architecture-71472a3ec3d6)

---

## Moderate Pitfalls

Mistakes that cause delays, technical debt, or require significant refactoring.

### Pitfall 6: CSS Conflicts Without Isolation Strategy

**What goes wrong:**
MFE A defines `.button { color: blue }`, MFE B defines `.button { color: red }`, last one loaded wins. Global CSS from one MFE bleeds into another, causing visual bugs and "works in isolation, breaks together" issues.

**Why it happens:**
CSS is global by default. Build-time integration concatenates all CSS into shared bundles, making collisions inevitable without scoping.

**Consequences:**
- Styles from MFE A override MFE B's components
- Visual regressions when deploying new MFE
- Can't test MFEs in isolation (different CSS in dev vs prod)
- UI inconsistency across pages
- Difficult debugging: "which MFE is styling this element?"

**Detection:**
- Visual differences between standalone MFE and integrated app
- Specificity wars: `!important` everywhere
- Same class names across MFE bundles
- CSS order dependency: works if A loads before B, breaks otherwise

**Prevention:**
1. **Choose one strategy and enforce it:**
   - **CSS Modules** (recommended for build-time): generates unique class names per MFE
   - **CSS-in-JS** (styled-components, emotion): scoped by default
   - **Tailwind with prefix**: `data-mfe-a:text-blue-500`
   - **BEM methodology**: `.reservations-button__primary--active`
   - **Shadow DOM**: full isolation but limits shared styling

2. For your build-time setup, CSS Modules is ideal:
   ```javascript
   // webpack.config.js for each MFE
   {
     test: /\.module\.css$/,
     use: [
       'style-loader',
       {
         loader: 'css-loader',
         options: {
           modules: {
             localIdentName: '[name]__[local]___[hash:base64:5]'
           }
         }
       }
     ]
   }
   ```

3. Use postcss-prefixwrap to namespace all CSS per MFE
4. Create shared design tokens package for consistent colors/spacing
5. Lint rule: no global CSS selectors without MFE prefix
6. Test in isolation AND integrated environments

**Phase to address:** Phase 4 (Build Configuration) - Set up before CSS is written

**Source confidence:** HIGH - [How to scale CSS in micro frontends](https://blog.logrocket.com/scaling-css-in-micro-frontends/), [Styles Isolation in microfrontends with React](https://alexbitko.medium.com/styles-isolation-in-microfrontends-with-react-including-material-styles-5f5cde4a724e), [CSS in Micro Frontends](https://dev.to/florianrappl/css-in-micro-frontends-4jai)

---

### Pitfall 7: No E2E Testing Strategy for Cross-MFE Flows

**What goes wrong:**
Each team tests their MFE in isolation. Integration bugs only appear when user flow spans multiple MFEs (login → search → reservation → checkout). No one owns the end-to-end test, so it doesn't exist.

**Why it happens:**
Team boundaries create testing silos. Unit and integration tests pass, but no one tests the seams between MFEs until production.

**Consequences:**
- Critical user journeys broken in production
- "It works in my MFE" becomes team mantra
- Event bus communication fails (sender publishes, no one subscribes)
- Data passed between MFEs has wrong shape
- Navigation between MFEs breaks (wrong URLs, missing state)

**Detection:**
- High unit test coverage, low E2E coverage
- No tests exercising cross-MFE user flows
- Production bugs that "can't be reproduced locally"
- Each team has their own E2E suite, testing only their MFE
- No ownership over integration test failures

**Prevention:**
1. **Create dedicated E2E test suite** owned by platform team or rotating ownership
2. Test critical user journeys that span MFEs:
   - Login → Dashboard → Reservation → Checkout
   - Search → Results → Details → Book
3. Test event bus contracts:
   ```javascript
   // Contract test
   it('publishes reservation.created with required fields', () => {
     const spy = jest.fn();
     eventBus.subscribe('reservation.created', spy);

     createReservation({ ... });

     expect(spy).toHaveBeenCalledWith({
       reservationId: expect.any(String),
       customerId: expect.any(String),
       // ... required fields
     });
   });
   ```
4. Use testing pyramid: 70% unit, 20% integration, 10% E2E
5. Run E2E tests against full integrated build, not isolated MFEs
6. Add E2E tests to CI that fail the build (don't just warn)
7. Document critical user paths and assign E2E test ownership

**Phase to address:** Phase 5 (First MFE Integration) - When second MFE integrates with first

**Source confidence:** MEDIUM - [Testing Strategies for Micro Frontends](https://www.lambdatest.com/blog/micro-frontends-testing-strategies/), [E2E testing single-spa](https://single-spa.js.org/docs/testing/e2e/), [Micro Frontends vs. Monoliths: Which is Better for Testing?](https://blog.bitsrc.io/the-testing-dilemma-in-micro-frontend-architecture-pros-and-cons-discussed-8cf9a6a90c3d)

---

### Pitfall 8: Premature Abstraction of Shared Components

**What goes wrong:**
Creating shared component library too early before understanding usage patterns. Teams abstract after 1-2 uses, creating rigid APIs that don't fit future needs. Shared components become bottleneck requiring coordination to change.

**Why it happens:**
DRY principle taken too far. Teams see similar-looking components (buttons, forms, cards) and immediately extract to shared library before understanding variation requirements.

**Consequences:**
- Shared components don't support needed variations
- MFE teams fork shared components, defeating the purpose
- Every shared component change requires coordinating 9 teams
- API changes to shared components break multiple MFEs
- Innovation slows because teams can't experiment without affecting everyone

**Detection:**
- Shared component API changes frequently (unstable)
- Teams copy-paste shared component instead of using it
- Component has 15+ props trying to cover all use cases
- Pull requests to shared lib require 5+ team approvals
- Teams build workarounds: "mini-button", "button-v2"

**Prevention:**
1. **Rule of three**: extract to shared lib after 3rd use, not 2nd
2. Let duplication exist in early phases - it's not that bad
3. When extracting, ensure API is proven by real usage
4. Version shared components library (semantic versioning)
5. Allow MFEs to use different versions temporarily
6. Extract only stable, truly common components:
   - Design system primitives (Button, Input, Card)
   - Complex components unlikely to diverge (DataTable)
   - NOT domain-specific components (ReservationCard)
7. Shared library should be optional, not mandatory

**Phase to address:** Phase 7-8 (After several MFEs exist) - Wait to see patterns

**Source confidence:** MEDIUM - [Top 10 Micro Frontend Anti-Patterns](https://dev.to/florianrappl/top-10-micro-frontend-anti-patterns-3809), general software engineering wisdom

---

### Pitfall 9: Build-Time Coupling Creates Release Train

**What goes wrong:**
Build-time integration requires all MFEs to be built together for each release. Teams can't deploy independently, creating release coordination overhead and deployment bottlenecks.

**Why it happens:**
Build-time integration is chosen for simplicity/performance but team doesn't anticipate the deployment coupling it creates.

**Consequences:**
- Can't hotfix single MFE without rebuilding all 9
- Release schedule requires coordinating 9 teams
- One team's delay blocks everyone's release
- Testing requires full integration build
- Rollback of one MFE requires rolling back all

**Detection:**
- Release process documentation shows "all teams must be ready"
- Build script builds all MFEs every time
- Deployment takes hours because full rebuild
- Hotfixes delayed waiting for release window
- Teams complaining about deployment independence

**Prevention:**
1. **Accept the tradeoff**: build-time = coupled deployments
2. Mitigate with versioned builds:
   ```javascript
   // Build only changed MFEs, use versioned artifacts for unchanged
   BUILD_MFES = ["shell", "reservations"] // changed
   CACHED_MFES = {
     "customers": "v1.2.3",
     "fleet": "v2.0.1",
     // ... unchanged MFEs
   }
   ```
3. Implement "micro-builds": rebuild only changed MFEs + shell
4. Tag MFE versions in git, reference by tag in shell
5. Create fast-follow process for hotfixes
6. Consider runtime integration for frequently-changing MFEs
7. Document deployment process and coordination requirements

**Alternative solution:**
Consider hybrid approach - critical path MFEs at runtime, stable ones at build-time.

**Phase to address:** Phase 4 (Build Configuration) - Plan deployment strategy upfront

**Source confidence:** HIGH - [Build-Time vs Runtime Integration](https://blog.bitsrc.io/micro-frontends-build-time-vs-runtime-integration-9bc771a1a42a), [Micro Frontend: Run-Time Vs. Build-Time Integration](https://www.syncfusion.com/blogs/post/micro-frontend-run-time-vs-build-time)

---

## Minor Pitfalls

Mistakes that cause annoyance but are easily fixable.

### Pitfall 10: Inconsistent Environment Variables Across MFEs

**What goes wrong:**
Each MFE has its own `.env` file with duplicate/inconsistent API endpoints, feature flags, and config. Updating a URL requires changing 9 files.

**Why it happens:**
MFEs created as independent repos or monorepo packages with separate configs.

**Consequences:**
- Dev environment points to staging API, production points to dev API
- Feature flags out of sync across MFEs
- Configuration drift causes integration bugs
- Tedious: every config change requires 9 PRs

**Prevention:**
1. Shell provides environment config to MFEs at runtime
2. Single source of truth for shared config
3. Use monorepo workspace with shared env packages
4. MFE-specific config only for MFE-specific needs

**Phase to address:** Phase 4 (Build Configuration)

**Source confidence:** LOW - common engineering practice

---

### Pitfall 11: Overly Complex Event Bus Naming

**What goes wrong:**
Event names become inconsistent: `user-authenticated`, `USER_LOGIN`, `auth.success`. No one knows what events exist or what data they carry.

**Why it happens:**
No documented contract for event bus communication.

**Consequences:**
- Events published but no one subscribes
- Typos in event names cause silent failures
- Debugging "why isn't X updating?" takes hours
- New developers don't know what events are available

**Prevention:**
1. Document event contracts in shared TypeScript types
   ```typescript
   // events.ts
   export type EventBus = {
     'user.authenticated': { userId: string; token: string };
     'reservation.created': { reservationId: string; customerId: string };
   }
   ```
2. Use consistent naming: `domain.action` (e.g., `user.logout`, `reservation.cancelled`)
3. Create event catalog documentation
4. Add runtime validation in dev mode
5. TypeScript-safe event bus library

**Phase to address:** Phase 3 (Shell Architecture)

**Source confidence:** MEDIUM - [Cross micro frontends communication](https://dev.to/luistak/cross-micro-frontends-communication-30m3)

---

### Pitfall 12: No MFE Version Visibility in Production

**What goes wrong:**
Production bug occurs, team doesn't know which MFE version is deployed. "Works on my machine" debugging ensues.

**Why it happens:**
No version metadata exposed in production builds.

**Consequences:**
- Can't correlate bug reports to MFE versions
- Rollback requires guessing which version was good
- Support tickets lack version context

**Prevention:**
1. Inject version into each MFE bundle
   ```javascript
   // webpack.config.js
   new webpack.DefinePlugin({
     __MFE_VERSION__: JSON.stringify(require('./package.json').version),
     __BUILD_TIME__: JSON.stringify(new Date().toISOString())
   })
   ```
2. Expose versions on `window.__MFE_VERSIONS__`
3. Add `/version` endpoint or console.log in dev mode
4. Include in error reporting metadata

**Phase to address:** Phase 4 (Build Configuration)

**Source confidence:** LOW - common DevOps practice

---

## Phase-Specific Warnings

Pitfalls likely to appear in specific migration phases:

| Phase | Likely Pitfall | Mitigation |
|-------|---------------|------------|
| **Phase 1: Domain Analysis** | Choosing page boundaries instead of business domains | Run DDD workshop, map bounded contexts, validate with backend teams |
| **Phase 2: Migration Strategy** | Planning big bang instead of incremental | Adopt Strangler Fig, identify first low-risk MFE, plan 2-4 week iterations |
| **Phase 3: Shell Architecture** | No clear routing or communication contracts | Document shell responsibilities, define event bus contracts, establish routing ownership |
| **Phase 4: Build Configuration** | No dependency sharing strategy | Configure Module Federation or webpack externals, monitor bundle size |
| **Phase 5: First MFE** | Building in isolation without integration testing | Integrate with shell immediately, test navigation and events |
| **Phase 6: Second MFE** | CSS conflicts appear | Implement CSS isolation strategy (CSS Modules recommended) |
| **Phase 7: Third+ MFE** | Premature abstraction to shared lib | Wait for rule of three, let duplication exist |
| **Phase 8: Full Migration** | No E2E tests for cross-MFE flows | Create integration test suite, assign ownership |
| **Phase 9: Production** | No deployment rollback strategy | Version artifacts, plan hotfix process |

---

## Anti-Patterns Summary

**Never do this:**
- Share React Context across MFEs (use event bus)
- Create 1 MFE per page without domain analysis
- Big bang migration of all 9 pages simultaneously
- Abstract to shared library after 1-2 uses
- Use global CSS without namespace/isolation
- Test MFEs only in isolation
- Deploy all MFEs as single artifact without versioning

**Always do this:**
- Start with domain-driven boundaries
- Migrate incrementally (Strangler Fig)
- Define communication contracts upfront
- Configure dependency sharing early
- Isolate CSS per MFE
- Test cross-MFE integration
- Version and monitor deployed MFEs

---

## Sources

### High Confidence (Multiple authoritative sources)

- [Domain-Driven Design in micro-frontend architecture](https://thesametech.com/domain-driven-design-in-micro-frontend-architecture/)
- [Identifying micro-frontends in our applications](https://medium.com/dazn-tech/identifying-micro-frontends-in-our-applications-4b4995f39257)
- [Incremental Migrations with Microfrontends](https://vercel.com/kb/guide/incremental-migrations-with-microfrontends)
- [Why all application migrations should be incremental](https://vercel.com/blog/incremental-migrations)
- [Strangler Fig Pattern](https://www.leanderhoedt.dev/blog/strangler-fig)
- [Shared Context in a Micro Frontends Architecture](https://medium.com/pecan-ai/shared-context-in-a-micro-frontends-architecture-75d7fbc8925c)
- [Understanding the Multiple Instance Problem in Micro Frontends](https://theplainscript.medium.com/understanding-the-multiple-instance-problem-in-micro-frontends-and-how-to-address-it-9519402d4362)
- [Ways to minimise Microfrontend bundle sizes](https://medium.com/mashroom-server/ways-to-minimize-microfrontend-bundle-sizes-876b2bbc115b)
- [Mastering Microfrontends: Sharing Dependencies Across Apps](https://medium.com/ama-tech-blog/mastering-microfrontends-sharing-dependencies-across-apps-e3811b650d7)
- [Routing Challenges in Micro Frontends](https://medium.com/@vasanthancomrads/routing-challenges-in-micro-frontends-and-how-to-solve-them-9ed6da536800)
- [Handling Routing in a Microfrontend Architecture](https://article.arunangshudas.com/handling-routing-in-a-microfrontend-architecture-71472a3ec3d6)
- [How to scale CSS in micro frontends](https://blog.logrocket.com/scaling-css-in-micro-frontends/)
- [Build-Time vs Runtime Integration](https://blog.bitsrc.io/micro-frontends-build-time-vs-runtime-integration-9bc771a1a42a)
- [Micro Frontend: Run-Time Vs. Build-Time Integration](https://www.syncfusion.com/blogs/post/micro-frontend-run-time-vs-build-time)

### Medium Confidence (Industry articles, case studies)

- [5 Pitfalls of Using Micro Frontends and How to Avoid Them](https://www.sitepoint.com/micro-frontend-architecture-pitfalls/)
- [Top 10 Micro Frontend Anti-Patterns](https://dev.to/florianrappl/top-10-micro-frontend-anti-patterns-3809)
- [Microfrontends Anti-Patterns: Seven Years in the Trenches](https://www.infoq.com/presentations/microfrontend-antipattern/)
- [Testing Strategies for Micro Frontends](https://www.lambdatest.com/blog/micro-frontends-testing-strategies/)
- [Cross micro frontends communication](https://dev.to/luistak/cross-micro-frontends-communication-30m3)
- [State Management in Micro Frontends](https://blog.pixelfreestudio.com/state-management-in-micro-frontends-tips-and-strategies/)
- [Martin Fowler: Micro Frontends](https://martinfowler.com/articles/micro-frontends.html)

### Research Papers

- [A Catalog of Micro Frontends Anti-patterns](https://arxiv.org/html/2411.19472v1) (2024)

---

## Research Methodology

**Tools used:**
- WebSearch for ecosystem survey and case studies (2024-2026 sources)
- Multiple query variations to cross-reference findings
- Prioritized recent sources (2024-2026) and authoritative technical blogs

**Verification:**
- Cross-referenced multiple sources for each critical pitfall
- Prioritized case studies and post-mortems over theoretical articles
- Validated patterns against academic research where available

**Confidence levels:**
- HIGH: 3+ authoritative sources agree, verified in production case studies
- MEDIUM: 2 credible sources, industry-accepted patterns
- LOW: Single source or common practice without formal validation

**Gaps:**
- Limited formal research on build-time vs runtime MFE migration outcomes
- Few documented car rental domain-specific MFE implementations
- Most sources focus on e-commerce, SaaS, or fintech domains
