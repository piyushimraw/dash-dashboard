# Phase 6: Reservation Lookup UI - Context

**Gathered:** 2026-01-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Improve the Reservation Lookup screen UI/UX for mobile, tablet, and desktop form factors using shadcn/ui components. Maintain current yellow/gold theming. This is a responsive redesign of existing functionality — no new features or data fields.

</domain>

<decisions>
## Implementation Decisions

### Search/Filter Layout
- Mobile: Bottom sheet for filters (slides up from bottom, thumb-friendly)
- Tablet: Uses mobile layout (bottom sheet for filters)
- Desktop: Inline row with filters and search on same horizontal row above table
- Active filter chips shown on all form factors — removable chips below search for all active filters with X to remove

### Touch & Mobile UX
- Row tap: No action — rows are display-only, actions via explicit buttons
- Search input: Expandable icon on mobile — magnifying glass that expands to full search on tap
- Swipe gestures: None — keep interactions simple, buttons only
- Sticky header: Search bar sticks to top while scrolling results on mobile

### Table Responsiveness
- Mobile/Tablet (<1024px): Card view — each reservation as a card with stacked fields
- Desktop (≥1024px): Table view with all columns visible
- Breakpoint switch at 1024px (lg)
- Table rows have alternating background colors (striped) for easier reading

### Information Density
- Mobile card content: Rich — all key fields including reservation #, customer name, dates, vehicle type, status badge, pickup/dropoff locations
- Text overflow: Wrap to multiple lines — show full text, allow wrapping
- Status display: Colored pill-shaped badges with status-specific color
- Date format: Always absolute — show full date/time format, no relative times

### Claude's Discretion
- Exact card layout and spacing
- Badge color palette (within yellow/gold theme)
- Bottom sheet animation and styling
- Sticky search implementation details

</decisions>

<specifics>
## Specific Ideas

- Cards should be clean and scannable — key info prominent
- Search expansion should feel native and responsive
- Filter chips provide quick visibility of active filters without opening the filter sheet

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-reservation-lookup-ui*
*Context gathered: 2026-01-23*
