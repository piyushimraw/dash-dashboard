# Phase 6: Reservation Lookup UI - Research

**Researched:** 2026-01-23
**Domain:** Responsive UI/UX with shadcn/ui and Tailwind CSS v4
**Confidence:** HIGH

## Summary

This research focused on implementing responsive UI improvements for the Reservation Lookup screen across mobile (<640px), tablet (640-1024px), and desktop (>1024px) form factors using shadcn/ui components and Tailwind CSS v4. The codebase already has a working DataTable with mobile card view and desktop table view using a JavaScript-based responsive detection hook, along with shadcn/ui components (Sheet, Select, Input, Button) integrated with yellow/gold theming.

The key challenge identified is Tailwind v4's breaking change with the `hidden` class behavior, which already caused issues in Phase 2 (Plan 02-09) and led to the adoption of JavaScript-based responsive detection (`useIsDesktop` hook) instead of CSS-only responsive classes. The existing implementation provides a solid foundation, but improvements are needed for touch targets, filter panel responsiveness, and column visibility management.

**Primary recommendation:** Continue using JavaScript-based responsive detection with the existing `useIsDesktop` hook pattern, enhance touch targets to meet WCAG 2.5.5 (44x44px minimum), and implement conditional filter UI (Sheet on mobile, Popover on desktop) while maintaining the established yellow/gold theming.

## Standard Stack

The project already has the required libraries installed and configured.

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| shadcn/ui | Latest (2026) | UI component library | Industry-standard accessible components built on Radix UI, designed for customization |
| Tailwind CSS | v4.1.18 | Utility-first CSS framework | New OKLCH color system, modern responsive breakpoints, mobile-first approach |
| @tanstack/react-table | v8.21+ | Headless table library | Industry standard for complex table functionality with full control over UI |
| Radix UI primitives | v2+ | Accessible component primitives | Powers shadcn/ui, WCAG 2.2/3.0 compliant, production-ready |
| lucide-react | v0.562.0 | Icon library | Consistent icon system, already integrated |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | v2.1.1 | Conditional className utility | Combining Tailwind classes conditionally |
| tailwind-merge | v3.4.0 | Merges Tailwind classes intelligently | Prevents class conflicts, already in use |
| class-variance-authority | v0.7.1 | Type-safe variant API | Creating component variants (buttons, etc) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| JS-based responsive detection | Tailwind v4 `hidden lg:block` | Tailwind v4 has known issues with `hidden` class behavior (Issue #15884), project already adopted JS approach |
| Sheet for all devices | Dialog/Popover for all | Sheet provides better mobile UX with edge positioning, but Dialog works cross-platform |
| Card layout on mobile | Horizontal scroll table | Cards are more touch-friendly and show less cramped data on small screens |

**Installation:**
All required packages are already installed. No additional installations needed.

## Architecture Patterns

### Recommended Project Structure
```
apps/mfe-reservation-lookup/src/
├── components/
│   ├── SearchComponent.tsx          # Already exists
│   ├── FiltersComponent.tsx         # Already exists - needs responsive enhancement
│   └── ResponsiveFilterPanel.tsx    # NEW - Sheet on mobile, Popover on desktop
├── hooks/
│   ├── useRentVehicleFilters.ts     # Already exists
│   └── useIsDesktop.ts              # Extract from DataTable for reuse
└── ReservationLookupPage.tsx        # Already exists
```

### Pattern 1: JavaScript-Based Responsive Detection
**What:** Use `window.matchMedia` to detect breakpoints in JavaScript rather than relying on Tailwind's responsive classes
**When to use:** When Tailwind v4's `hidden lg:block` pattern is unreliable (as discovered in Phase 2, Plan 02-09)
**Example:**
```typescript
// Source: Project codebase (packages/ui/src/components/table/DataTable.tsx)
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkWidth = () => setIsDesktop(window.innerWidth >= 1024);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  return isDesktop;
}
```

**Why this pattern:**
- Tailwind v4 changed `hidden` class priority (Issue #15884), making `hidden lg:block` unreliable
- JavaScript detection provides guaranteed behavior across browsers
- Already proven working in the DataTable implementation (Phase 2, Plan 02-09)

### Pattern 2: Conditional Component Rendering for Responsive Filters
**What:** Render different components based on screen size - Sheet (drawer) on mobile, Popover on desktop
**When to use:** For filter panels, settings, or any overlay content that needs different UX on mobile vs desktop
**Example:**
```typescript
// Pattern from research: shadcn/ui responsive patterns
export function ResponsiveFilterPanel() {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button>Filters</Button>
        </PopoverTrigger>
        <PopoverContent align="end">
          <FilterForm />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Filters</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <FilterForm />
      </SheetContent>
    </Sheet>
  );
}
```

**Why this pattern:**
- Sheet provides better mobile UX with swipe gestures and full-screen focus
- Popover is more appropriate for desktop with contextual positioning
- Common pattern in production applications (Material UI, shadcn/ui examples)

### Pattern 3: Mobile Card View for Tables
**What:** Transform table rows into card layouts on mobile for better readability
**When to use:** When table has many columns that would be cramped on mobile
**Example:**
```typescript
// Source: Project codebase (packages/ui/src/components/table/DataTable.tsx)
{!isDesktop && (
  <div className="space-y-4">
    {table.getRowModel().rows.map((row) => (
      <div key={row.id} className="border border-lavender rounded-lg p-4 bg-white shadow-sm space-y-3">
        {row.getVisibleCells().map((cell) => (
          <div key={cell.id} className="flex justify-between items-start gap-4">
            <div className="font-medium text-sm text-gray-600 min-w-[100px]">
              {headerText}
            </div>
            <div className="flex-1 text-right text-sm">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          </div>
        ))}
      </div>
    ))}
  </div>
)}
```

### Pattern 4: WCAG-Compliant Touch Targets
**What:** Ensure all interactive elements meet minimum 44x44px size on mobile devices
**When to use:** For all buttons, inputs, and interactive elements across all breakpoints
**Example:**
```typescript
// Source: Project codebase (packages/ui/src/components/button.tsx)
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium...",
  {
    variants: {
      size: {
        default: "h-11 px-5 py-2 min-h-[44px]",
        sm: "h-10 rounded-md px-4 text-xs min-h-[40px]",
        lg: "h-12 rounded-xl px-8 text-base min-h-[48px]",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px]",
      },
    },
  }
)
```

**Additional touch target CSS:**
```css
/* Source: Project codebase (apps/shell/src/index.css) */
@media (pointer: coarse) {
  /* Ensure minimum touch target size on touch devices */
  button,
  [role="button"],
  a,
  input,
  select,
  textarea {
    min-height: 44px;
  }
}
```

### Anti-Patterns to Avoid
- **Relying on `hidden lg:block` in Tailwind v4:** The `hidden` class no longer appears last in CSS cascade, causing unpredictable behavior. Use JavaScript-based detection instead.
- **Using inline-flex with hidden class:** In v4, `inline-flex` overrides `hidden` due to CSS ordering. Use the HTML `hidden` attribute or `!hidden` (important modifier) if needed.
- **Horizontal scroll for mobile tables without consideration:** While simple, horizontal scroll is less user-friendly than card layouts for touch devices. Reserve for tables with few essential columns.
- **Mixing responsive approaches:** Don't mix CSS-based `hidden lg:block` with JS-based detection in the same component - choose one approach and be consistent.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Media query hooks | Custom window.addEventListener logic | Material UI useMediaQuery or extract existing useIsDesktop | SSR-safe, performant, handles edge cases (orientation change, resize debouncing) |
| Table column visibility | Custom CSS show/hide logic | TanStack Table columnVisibility API | Type-safe, state management, integrates with table instance |
| Touch target sizing | Manual min-width/min-height on each element | CSS media query `@media (pointer: coarse)` with blanket rules | Automatic for all interactive elements, accessibility built-in |
| Responsive filter panels | Building custom drawer/modal logic | shadcn/ui Sheet + Popover with conditional rendering | Accessibility, animations, focus management, keyboard nav all handled |
| Color theme management | Hardcoded color values | Tailwind CSS custom variables in `@theme` | Consistent theming, easy maintenance, design tokens |

**Key insight:** Responsive UI has many edge cases (SSR hydration, resize events, orientation changes, touch vs pointer devices). Use battle-tested libraries rather than building from scratch. The project already has the right tools integrated.

## Common Pitfalls

### Pitfall 1: Tailwind v4 `hidden` Class Behavior Change
**What goes wrong:** Using `hidden lg:block` to show/hide elements doesn't work reliably in Tailwind v4. Elements remain visible or hidden when they shouldn't be.
**Why it happens:** In v4, the `hidden` utility class was moved from the end of the display utilities cascade to the middle (after `block`, before `inline-flex` and `inline-block`). This breaks the expected specificity behavior.
**How to avoid:**
1. Use JavaScript-based responsive detection (like the existing `useIsDesktop` hook)
2. Use the HTML `hidden` attribute instead of the `hidden` class
3. Use the important modifier: `!hidden` or `hidden!`
4. For breakpoint-specific hiding, prefer `max-lg:hidden` over `hidden lg:block`
**Warning signs:** Components that should be hidden are visible, or vice versa. Browser DevTools shows both `hidden` and `block` classes applied with unexpected computed styles.
**Source:** https://github.com/tailwindlabs/tailwindcss/issues/15884

### Pitfall 2: Insufficient Touch Target Sizes
**What goes wrong:** Buttons, inputs, and interactive elements that work fine on desktop are difficult to tap on mobile, leading to frustration and mis-taps.
**Why it happens:** Desktop hover states and mouse precision don't translate to touch devices. Developers test on desktop and miss mobile usability issues.
**How to avoid:**
1. Set `min-height: 44px` and `min-width: 44px` for all interactive elements
2. Use `@media (pointer: coarse)` to automatically apply sizing on touch devices
3. Add `touch-manipulation` CSS to prevent double-tap zoom delays
4. Test on actual mobile devices, not just browser DevTools
**Warning signs:** User complaints about "buttons being hard to tap", high error rates on mobile analytics, accessibility audit failures (WCAG 2.5.5 or 2.5.8).
**Reference:** WCAG 2.2 Success Criterion 2.5.8 (Level AA) requires 24x24px minimum, but 44x44px (AAA) is the recommended best practice.
**Sources:**
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html
- https://www.smashingmagazine.com/2023/04/accessible-tap-target-sizes-rage-taps-clicks/

### Pitfall 3: Not Considering Column Priority on Mobile
**What goes wrong:** All table columns are shown on mobile in card view, leading to information overload and poor UX. Users scroll through 15+ fields per card.
**Why it happens:** Desktop tables show all columns by default, and developers simply map all columns to mobile cards without considering mobile-specific information hierarchy.
**How to avoid:**
1. Use TanStack Table's `columnVisibility` state to hide non-essential columns on mobile
2. Define column metadata (e.g., `meta: { hiddenOnMobile: true }`) for conditional visibility
3. Prioritize customer name, status, dates - hide secondary info like internal IDs
4. Consider separate "details" view for full information instead of cramming into cards
**Warning signs:** Mobile cards are very tall (>500px), users complain about "too much scrolling", important info is buried below the fold.
**Source:** https://dev.to/juancruzroldan/responsive-collapse-of-columns-in-tanstack-table-2175

### Pitfall 4: Filter Panel UX Inconsistency Across Devices
**What goes wrong:** Using the same filter UI (e.g., Sheet drawer) on both mobile and desktop leads to awkward UX on one platform.
**Why it happens:** Developers choose the easier single implementation rather than conditional rendering based on device type.
**How to avoid:**
1. Use Sheet (drawer from bottom or side) on mobile for full-screen focus and swipe gestures
2. Use Popover on desktop for contextual positioning near trigger button
3. Implement with `useIsDesktop` hook for conditional component rendering
4. Keep filter state and logic shared, only render UI differently
**Warning signs:** Desktop users complain about "too much screen real estate used by filters", mobile users complain about "tiny filter panel that's hard to use".
**Sources:**
- https://ui.shadcn.com/docs/components/sheet
- https://ui.shadcn.com/docs/components/popover

### Pitfall 5: Ignoring SSR/Hydration Issues with Responsive Detection
**What goes wrong:** JavaScript-based responsive detection causes hydration mismatches, flashing content, or layout shifts on initial load.
**Why it happens:** Server renders mobile view, client detects desktop, causing re-render and layout shift.
**How to avoid:**
1. Set initial state to `true` (desktop) in `useIsDesktop` to match SSR default
2. Use `useEffect` to detect and update on client side only
3. Consider `noSsr` option or client-only rendering for responsive components
4. Test with slow 3G throttling to catch layout shifts
**Warning signs:** Console warnings about hydration mismatch, visible flash from mobile to desktop layout on load, Lighthouse CLS (Cumulative Layout Shift) score degradation.
**Note:** Current implementation sets `useState(true)` which is SSR-safe.
**Source:** https://mui.com/material-ui/react-use-media-query/

## Code Examples

Verified patterns from official sources and project codebase:

### Extract useIsDesktop Hook for Reuse
```typescript
// Source: Project pattern from packages/ui/src/components/table/DataTable.tsx
// Recommendation: Extract to packages/ui/src/hooks/useIsDesktop.ts for reuse

import { useState, useEffect } from "react";

/**
 * Detects if viewport is desktop size (>= 1024px)
 * Uses JavaScript instead of Tailwind responsive classes due to v4 issues
 * @returns {boolean} true if desktop (lg breakpoint and above)
 */
export function useIsDesktop(breakpoint: number = 1024): boolean {
  // Initialize to true for SSR safety and better desktop-first UX
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkWidth = () => setIsDesktop(window.innerWidth >= breakpoint);

    // Check immediately
    checkWidth();

    // Add resize listener
    window.addEventListener("resize", checkWidth);

    // Cleanup
    return () => window.removeEventListener("resize", checkWidth);
  }, [breakpoint]);

  return isDesktop;
}
```

### Responsive Filter Panel Pattern
```typescript
// NEW component pattern for apps/mfe-reservation-lookup/src/components/

import { useIsDesktop } from "@packages/ui/hooks/useIsDesktop";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
} from "@packages/ui";

interface FilterPanelProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function ResponsiveFilterPanel({
  trigger,
  children,
  title = "Filters",
  description = "Refine your search results",
}: FilterPanelProps) {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          {trigger}
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            {children}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

### Column Visibility Based on Screen Size
```typescript
// Pattern for TanStack Table column configuration

import { type ColumnDef } from "@tanstack/react-table";
import { useIsDesktop } from "@packages/ui/hooks/useIsDesktop";

// Extend ColumnMeta type for responsive metadata
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    hiddenOnMobile?: boolean;
    priority?: "high" | "medium" | "low"; // For future column priority sorting
  }
}

export function useResponsiveColumns<TData>(
  allColumns: ColumnDef<TData>[]
): ColumnDef<TData>[] {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return allColumns;
  }

  // On mobile, filter out columns marked as hiddenOnMobile
  return allColumns.filter(
    (col) => !col.meta?.hiddenOnMobile
  );
}

// Usage in table definition:
const columns: ColumnDef<TableType>[] = [
  {
    accessorKey: "id",
    header: "#",
    meta: { hiddenOnMobile: true }, // Hide on mobile
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    // Always show (no meta)
  },
  {
    accessorKey: "email",
    header: "Email",
    meta: { hiddenOnMobile: true }, // Hide on mobile
  },
  // ... more columns
];

const visibleColumns = useResponsiveColumns(columns);
```

### Touch-Friendly Input Wrapper
```typescript
// Pattern for ensuring touch targets on mobile

import { Input, type InputProps } from "@packages/ui";
import { cn } from "@packages/ui/lib/utils";

export function TouchInput({ className, ...props }: InputProps) {
  return (
    <Input
      className={cn(
        "min-h-[44px] touch-manipulation",
        className
      )}
      {...props}
    />
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind v3 `hidden lg:block` | JavaScript-based `useIsDesktop` hook | Phase 2 (Plan 02-09) | More reliable responsive behavior, works around Tailwind v4 bug |
| Single filter UI for all devices | Conditional Sheet/Popover based on device | Not yet implemented | Better UX per device type, follows industry patterns |
| Show all table columns on mobile | Conditional column visibility with metadata | Not yet implemented | Less cluttered mobile cards, better information hierarchy |
| 40px minimum touch targets | 44px minimum (WCAG AAA) | Already implemented in Button component | Better accessibility, lower mis-tap rates |
| RGB color system | OKLCH color system (Tailwind v4) | Phase 1 (infrastructure) | More vivid colors, better contrast, wider P3 gamut |

**Deprecated/outdated:**
- **CSS-only responsive hiding with `hidden lg:block`**: Use JavaScript-based detection due to Tailwind v4 Issue #15884
- **Single responsive filter pattern**: Industry moved to device-specific UIs (Sheet on mobile, Popover on desktop)
- **24px touch targets (WCAG AA)**: Best practice is now 44px (WCAG AAA) for better mobile usability

## Open Questions

Things that couldn't be fully resolved:

1. **UI-01 Requirement Definition**
   - What we know: Phase 6 references "Requirements: UI-01" in ROADMAP.md
   - What's unclear: UI-01 is not defined in REQUIREMENTS.md - only requirements through PWA-06 are documented
   - Recommendation: UI-01 likely covers the success criteria listed in Phase 6. Proceed with Phase 6 success criteria as the requirements. If specific additional requirements exist, they should be added to REQUIREMENTS.md.

2. **Filter Panel Default Behavior**
   - What we know: Current FiltersComponent uses Sheet for all devices
   - What's unclear: Should filters default to open or closed on desktop? Should mobile use bottom Sheet or side Sheet?
   - Recommendation: Use Sheet from bottom on mobile (full-screen focus), Popover from right on desktop (contextual). Both default to closed. User research can validate.

3. **Column Visibility Strategy**
   - What we know: DataTable shows all 15 columns on mobile cards currently
   - What's unclear: Which columns are "must show" vs "nice to have" on mobile? Should there be a "Show More" expansion?
   - Recommendation: Start with high-priority columns (ID, Customer Name, Status, Dates). Make remaining columns available via column visibility toggle or details view. Validate with user feedback.

4. **Tablet Breakpoint Handling**
   - What we know: Current code uses single breakpoint (1024px) for desktop detection
   - What's unclear: Should tablet (640-1024px) get mobile UI, desktop UI, or hybrid UI?
   - Recommendation: Treat 640-1024px as "large mobile" with mobile card layout but desktop filter UI (Popover). This provides good UX without building a third layout variant.

## Sources

### Primary (HIGH confidence)
- Tailwind CSS Responsive Design Docs - https://tailwindcss.com/docs/responsive-design
- shadcn/ui Sheet Component - https://ui.shadcn.com/docs/components/sheet
- shadcn/ui Popover Component - https://ui.shadcn.com/docs/components/popover
- WCAG 2.5.5 Target Size (Enhanced) - https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html
- TanStack Table Column Visibility Guide - https://tanstack.com/table/v8/docs/guide/column-visibility
- Tailwind v4 Hidden Class Issue #15884 - https://github.com/tailwindlabs/tailwindcss/issues/15884
- Project codebase: packages/ui/src/components/table/DataTable.tsx (existing implementation)
- Project codebase: apps/shell/src/index.css (existing touch target CSS)

### Secondary (MEDIUM confidence)
- Smashing Magazine - Accessible Touch Target Sizes - https://www.smashingmagazine.com/2023/04/accessible-tap-target-sizes-rage-taps-clicks/
- Material UI useMediaQuery - https://mui.com/material-ui/react-use-media-query/
- DEV Community - Responsive Collapse in TanStack Table - https://dev.to/juancruzroldan/responsive-collapse-of-columns-in-tanstack-table-2175
- Tailwind v4 Breakpoint Override Guide - https://bordermedia.org/blog/tailwind-css-4-breakpoint-override
- FullStack Labs - Building Responsive Filter Component - https://www.fullstack.com/labs/resources/blog/building-a-responsive-filter-component-on-react

### Tertiary (LOW confidence)
- shadcn/ui community examples and studio components
- WebSearch results about responsive patterns (general patterns, not specific implementation details)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already installed and versions verified from package.json
- Architecture: HIGH - Patterns verified from official docs and existing codebase implementation
- Pitfalls: HIGH - Tailwind v4 issue verified from GitHub, WCAG standards from W3C, project lessons from Phase 2 Summary
- Code examples: HIGH - Extracted from project codebase and official documentation
- Responsive patterns: MEDIUM - Sheet/Popover pattern is industry standard but not yet verified in this specific codebase
- Column visibility: MEDIUM - TanStack Table API verified, but specific mobile column strategy needs validation

**Research date:** 2026-01-23
**Valid until:** 2026-02-23 (30 days - stable ecosystem, but Tailwind v4 is relatively new)

**Key constraints from prior decisions:**
- Must use JavaScript-based responsive detection (Phase 2, Plan 02-09 decision)
- Must preserve yellow/gold theming (Phase 6 success criteria)
- Must maintain 44x44px touch targets (already implemented, WCAG compliance)
- Must support mobile card layout for DataTable (already implemented in Phase 2)
