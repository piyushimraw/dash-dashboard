# Phase 5: Installation Banner - Context

**Gathered:** 2026-01-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Add PWA installation prompt banner to encourage users to install the application from browser. Handles the beforeinstallprompt event, displays a banner, and triggers native installation. Does not include post-install onboarding or analytics tracking.

</domain>

<decisions>
## Implementation Decisions

### Banner Placement & Style
- Fixed bottom bar (sticky at bottom of viewport)
- Prominent with brand colors — eye-catching, uses primary brand colors
- Include app icon preview alongside text
- Slide up animation on appearance

### Trigger Timing
- Show immediately on first eligible visit (when beforeinstallprompt fires)
- Show on all pages, not restricted to specific routes
- No delay — show immediately when install is available
- Stay visible across navigation until dismissed or installed
- Always visible (no hiding during form input)
- Show to all users (logged-in and logged-out)
- Same banner size on mobile and desktop (responsive but consistent)

### Dismissal Behavior
- X button only (no swipe gestures)
- Reappear on next session (not permanent dismissal)
- Use sessionStorage to track dismissal (clears when browser closes)
- No separate "Don't ask again" option

### Content & Messaging
- Direct and minimal tone
- Button text: "Install"
- No app name — just generic "Install app" message
- Brief benefit subtext (e.g., "Works offline" or "Faster access")

### Claude's Discretion
- Exact subtext wording
- Icon size and spacing
- Animation duration and easing
- Z-index and shadow styling

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches within the decisions above.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-installation-banner*
*Context gathered: 2026-01-23*
