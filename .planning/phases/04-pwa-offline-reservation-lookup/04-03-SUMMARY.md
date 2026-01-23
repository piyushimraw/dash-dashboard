---
phase: 04-pwa-offline-reservation-lookup
plan: 03
subsystem: pwa
tags: [offline-indicator, useSyncExternalStore, network-state, workbox, accessibility]

# Dependency graph
requires:
  - phase: 04-01
    provides: Service worker with Workbox runtime caching and offline.html fallback
  - phase: 04-02
    provides: React Query persistence to IndexedDB with offlineFirst mode
provides:
  - useNetworkState hook for tracking online/offline status
  - OfflineIndicator component with accessible amber banner
  - Complete PWA offline UX for Reservation Lookup module
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns: [useSyncExternalStore for browser API subscriptions, prop-driven indicator component]

key-files:
  created:
    - apps/shell/src/hooks/useNetworkState.ts
    - packages/ui/src/components/OfflineIndicator.tsx
  modified:
    - packages/ui/src/index.ts
    - apps/shell/src/components/layout/Header.tsx
    - apps/shell/vite.config.ts

key-decisions:
  - "useSyncExternalStore for React 18+ concurrent mode compatibility"
  - "OfflineIndicator receives isOnline as prop for decoupling from specific hook"
  - "Amber color scheme matches Hertz brand and warning context"
  - "navigateFallback changed to index.html, offline.html served only on network failure"

patterns-established:
  - "Network state pattern: useSyncExternalStore with browser online/offline events"
  - "Indicator pattern: prop-driven component with null render when not applicable"
  - "Service worker fallback: NetworkFirst with handlerDidError for graceful offline page"

# Metrics
duration: 8min
completed: 2026-01-23
---

# Phase 04 Plan 03: Offline Mode Indicator Summary

**Network state hook and accessible offline banner integrated in header, with service worker fix for proper offline.html fallback on network failure**

## Performance

- **Duration:** 8 min
- **Started:** 2026-01-23T03:00:00Z
- **Completed:** 2026-01-23T03:08:00Z
- **Tasks:** 4 (3 auto + 1 human verification)
- **Files modified:** 5

## Accomplishments
- Created useNetworkState hook using useSyncExternalStore for React 18+ concurrent mode support
- Built accessible OfflineIndicator component with amber warning banner and wifi-off icon
- Integrated offline indicator in shell header with immediate online/offline feedback
- Fixed service worker to use index.html for SPA navigation, offline.html only on actual network failure

## Task Commits

Each task was committed atomically:

1. **Task 1: Create useNetworkState hook** - `532e394` (feat)
2. **Task 2: Create OfflineIndicator component** - `07ff054` (feat)
3. **Task 3: Integrate OfflineIndicator in shell header** - `6a73b68` (feat)
4. **Task 4: Human verification** - APPROVED

**Verification fix:** `8944566` (fix) - Service worker navigateFallback correction

## Files Created/Modified
- `apps/shell/src/hooks/useNetworkState.ts` - Hook tracking online/offline using useSyncExternalStore
- `packages/ui/src/components/OfflineIndicator.tsx` - Accessible amber banner with wifi-off icon
- `packages/ui/src/index.ts` - Added OfflineIndicator export
- `apps/shell/src/components/layout/Header.tsx` - Integrated OfflineIndicator above header
- `apps/shell/vite.config.ts` - Fixed navigateFallback strategy

## Technical Details

### useNetworkState.ts
```typescript
export function useNetworkState(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
```
- Uses `useSyncExternalStore` (React 18+) for concurrent mode safety
- Subscribes to browser `online`/`offline` events
- Returns `true` on server for SSR compatibility
- JSDoc notes navigator.onLine limitations (false positives possible)

### OfflineIndicator.tsx
- Props: `isOnline: boolean`, `className?: string`
- Uses `role="alert"` and `aria-live="polite"` for accessibility
- Inline SVG wifi-off icon (no external dependencies)
- Returns `null` when online (zero DOM footprint)
- Amber color scheme: `bg-amber-100`, `border-amber-300`, `text-amber-800`

### Header.tsx Integration
- OfflineIndicator renders above header in a React fragment
- Banner appears immediately when network drops
- Disappears immediately when connection restored

## Decisions Made
- useSyncExternalStore chosen for concurrent mode compatibility (React 18+ best practice)
- OfflineIndicator receives isOnline as prop to decouple from specific hook implementation
- Amber/yellow styling matches Hertz brand and conveys warning without alarm
- navigateFallback changed from offline.html to index.html for SPA routing support

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed navigateFallback showing offline.html for all navigation**
- **Found during:** Task 4 (Human verification)
- **Issue:** Using `navigateFallback: '/offline.html'` caused offline.html to display for all navigation requests, even when SPA should handle routing
- **Fix:** Changed navigateFallback to `/index.html` for normal SPA shell, added NetworkFirst handler with `handlerDidError` callback to serve offline.html only when network actually fails
- **Files modified:** apps/shell/vite.config.ts
- **Verification:** Human verified online navigation works, offline navigation shows offline.html only on network failure
- **Committed in:** `8944566`

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Fix was essential for correct SPA navigation behavior. No scope creep.

## Issues Encountered

None beyond the deviation documented above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 4 (PWA & Offline Support) is now complete
- Reservation Lookup module fully works offline with:
  - Service worker caching API responses (04-01)
  - React Query cache persistence to IndexedDB (04-02)
  - Visual offline indicator in header (04-03)
- All MFE architecture phases complete (01-04)

---
*Phase: 04-pwa-offline-reservation-lookup*
*Completed: 2026-01-23*
