# Phase 1: Infrastructure - Context

**Gathered:** 2026-01-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish monorepo foundation with shared packages (UI, API client, event bus, types) and shell infrastructure for MFE orchestration. This phase delivers the foundation that all MFEs will build upon — not the MFEs themselves.

</domain>

<decisions>
## Implementation Decisions

### Shell Layout & Chrome
- Sidebar collapsible to icon-only rail on desktop (expands on hover or click)
- Hamburger drawer for mobile navigation (slides in from left)
- Header contains breadcrumbs for page context + user avatar/dropdown on right
- Light theme only — no dark mode support

### Auth UX Patterns
- Silent token refresh in background; only show login if refresh fails
- Hide unauthorized nav items/buttons entirely (don't show disabled)
- Login page is a route within the shell SPA, not a separate entry point
- Deep link preservation: store intended URL, redirect back after successful login

### Package Boundaries
- Shared UI package includes common patterns (DataTable, Form layouts, SearchInput) not just primitives
- Event bus naming: MFE-prefixed format (e.g., `rent-mfe:completed`, `dashboard-mfe:refresh-requested`)
- MFEs can import types from other MFEs, but no runtime code imports between apps/
- API endpoints defined per-MFE with shared base client and interceptors from @packages/api-client

### Error & Loading States
- MFE crash: minimal inline error where MFE would render, rest of shell continues working
- MFE chunk loading: thin progress bar across top of page (like YouTube/GitHub)
- Global errors (network, API 500): toast notifications, non-blocking
- Shell initialization: branded splash screen until auth check and config fetch complete

### Claude's Discretion
- Exact sidebar animation/transition timing
- Breadcrumb depth and truncation logic
- Splash screen branding/design
- Toast positioning and auto-dismiss timing
- Specific skeleton placeholder designs if needed elsewhere

</decisions>

<specifics>
## Specific Ideas

- Progress bar at top should feel snappy like GitHub's page transitions
- Sidebar collapse should preserve user's preference across sessions

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-infrastructure*
*Context gathered: 2026-01-22*
