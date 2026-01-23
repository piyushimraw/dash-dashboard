---
phase: 04-pwa-offline-reservation-lookup
plan: 02
subsystem: pwa
tags: [react-query, indexeddb, offline-first, idb-keyval, persist-client]

# Dependency graph
requires:
  - phase: 04-01
    provides: Service worker API caching and idb-keyval dependency
provides:
  - IndexedDB persister for React Query cache
  - offlineFirst networkMode for queries
  - PersistQueryClientProvider wrapping app
affects: [04-03]

# Tech tracking
tech-stack:
  added: []
  patterns: [offlineFirst networkMode, IndexedDB cache persistence, dehydration filtering]

key-files:
  created:
    - apps/shell/src/lib/queryPersister.ts
  modified:
    - packages/api-client/src/queryClient.ts
    - apps/shell/src/main.tsx

key-decisions:
  - "offlineFirst networkMode allows queries to fire when offline for SW interception"
  - "24-hour gcTime matches persister maxAge to prevent timing issues"
  - "shouldDehydrateQuery filters to persist only successful queries with data"
  - "Persister created outside component to avoid recreation on each render"

patterns-established:
  - "idb-keyval factory pattern: createIDBPersister() returns Persister interface"
  - "PersistQueryClientProvider wraps entire app for cache hydration on load"

# Metrics
duration: 3min
completed: 2026-01-23
---

# Phase 04 Plan 02: React Query Persistence Summary

**React Query cache persists to IndexedDB with offlineFirst mode, enabling offline data access after page reload**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-22T21:14:40Z
- **Completed:** 2026-01-22T21:17:13Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- Created IndexedDB persister using idb-keyval for async cache storage
- Configured QueryClient with offlineFirst networkMode and 24h gcTime
- Integrated PersistQueryClientProvider to hydrate cache on app load

## Task Commits

Each task was committed atomically:

1. **Task 1: Create IndexedDB persister for React Query** - `f6f3fa8` (feat)
2. **Task 2: Update QueryClient with offline-first configuration** - `a95c349` (feat)
3. **Task 3: Integrate PersistQueryClientProvider in main.tsx** - `395c16a` (feat)
4. **Dependencies install** - `44fe3f6` (chore)

## Files Created/Modified
- `apps/shell/src/lib/queryPersister.ts` - Factory function using idb-keyval for IndexedDB persistence
- `packages/api-client/src/queryClient.ts` - Added networkMode, gcTime, refetchOnReconnect options
- `apps/shell/src/main.tsx` - Replaced QueryClientProvider with PersistQueryClientProvider

## Technical Details

### queryPersister.ts
```typescript
export function createIDBPersister(idbValidKey: IDBValidKey = 'hertz-query-cache'): Persister
```
- Uses `idb-keyval` for async IndexedDB operations (get, set, del)
- Default key 'hertz-query-cache' for easy DevTools identification
- Returns Persister interface compatible with @tanstack/react-query-persist-client

### queryClient.ts Changes
- `networkMode: 'offlineFirst'` - Queries fire even offline, SW serves cached responses
- `gcTime: 24 * 60 * 60 * 1000` - 24h garbage collection matches persister maxAge
- `refetchOnReconnect: true` - Fresh data when coming back online

### main.tsx Integration
- Replaced QueryClientProvider with PersistQueryClientProvider
- Created persister outside component for stability
- `shouldDehydrateQuery` filters to only persist successful queries with data
- 24h maxAge prevents cache from expiring before gcTime

## Decisions Made
- offlineFirst networkMode chosen so React Query fires requests offline (SW can intercept)
- 24h alignment between gcTime and maxAge prevents data eviction timing bugs
- shouldDehydrateQuery filter prevents persisting loading/error states

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed successfully.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- React Query cache now persists to IndexedDB - data survives page reload
- offlineFirst mode works with service worker caching from 04-01
- Ready for offline mode indicator UI (04-03)

---
*Phase: 04-pwa-offline-reservation-lookup*
*Completed: 2026-01-23*
