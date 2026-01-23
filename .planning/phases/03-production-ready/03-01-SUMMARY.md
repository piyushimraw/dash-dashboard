---
phase: 03-production-ready
plan: 01
status: complete
started: 2026-01-23
completed: 2026-01-23
duration: 3min
subsystem: build-optimization
tags: [vite, rollup, code-splitting, bundle-optimization]

dependency-graph:
  requires: [02-09]
  provides: [vendor-splitting, bundle-analyzer]
  affects: [03-02, 03-03]

tech-stack:
  added: [rollup-plugin-visualizer]
  patterns: [manualChunks, pnpm-path-handling]

key-files:
  created:
    - apps/shell/dist/stats.html
    - apps/shell/dist/assets/vendor-react-*.js
    - apps/shell/dist/assets/vendor-radix-*.js
    - apps/shell/dist/assets/vendor-tanstack-*.js
    - apps/shell/dist/assets/vendor-zustand-*.js
    - apps/shell/dist/assets/vendor-other-*.js
  modified:
    - apps/shell/vite.config.ts
    - package.json
    - pnpm-lock.yaml

decisions:
  - decision: "Split vendor chunks by library domain (React, Radix, TanStack, Zustand)"
    rationale: "Maximizes cache efficiency - app code changes don't invalidate vendor cache"
  - decision: "Handle pnpm nested node_modules path structure"
    rationale: "pnpm uses .pnpm/pkg@version/node_modules/pkg structure"
  - decision: "Include scheduler in vendor-react chunk"
    rationale: "React runtime dependency, should stay with React for caching"

metrics:
  duration: 3min
  completed: 2026-01-23
---

# Plan 03-01 Summary: Configure Vite build optimization with manualChunks

**One-liner:** manualChunks vendor splitting with pnpm support, producing 5 cacheable vendor chunks (React 189kB, TanStack 162kB, other 136kB, Radix 23kB, Zustand 3kB)

## What Was Done

### Task 1: Configure manualChunks for vendor splitting
- Installed rollup-plugin-visualizer for bundle analysis
- Added manualChunks function to vite.config.ts with pnpm path handling
- Configured vendor chunk splitting:
  - `vendor-react`: React, React-DOM, scheduler
  - `vendor-tanstack`: TanStack Router, Query, Table
  - `vendor-radix`: Radix UI primitives
  - `vendor-zustand`: Zustand state management
  - `vendor-other`: remaining dependencies (lucide, date-fns, clsx, etc.)
- Set chunkSizeWarningLimit to 150 kB
- Added visualizer plugin with gzip/brotli size analysis
- Commit: `cbdb59a`

### Task 2: Verify chunk structure and cache efficiency
- Verified build produces correct vendor chunks
- Confirmed route chunks contain only application code (no vendor duplication)
- Validated stats.html provides bundle visualization

## Build Output Analysis

### Before (single index chunk)
- `index-*.js`: 482.50 kB (ALL vendor dependencies)

### After (vendor splitting)
| Chunk | Size | gzip | Contents |
|-------|------|------|----------|
| vendor-react | 193.21 kB | 60.60 kB | React, React-DOM, scheduler |
| vendor-tanstack | 166.11 kB | 49.18 kB | Router, Query, Table |
| vendor-other | 139.71 kB | 44.71 kB | lucide, date-fns, clsx, mitt |
| vendor-radix | 24.01 kB | 7.68 kB | Radix UI primitives |
| vendor-zustand | 2.68 kB | 1.33 kB | Zustand |
| **Total Vendor** | **525.72 kB** | **163.50 kB** | |

### Route Chunks (unchanged, application code only)
| Chunk | Size | gzip |
|-------|------|------|
| _auth (layout) | 17.14 kB | 6.07 kB |
| _auth.reservation_lookup | 19.91 kB | 6.19 kB |
| _auth.return | 2.91 kB | 1.14 kB |
| _auth.dashboard | 1.92 kB | 0.89 kB |
| _auth.rent | 1.44 kB | 0.68 kB |
| Other routes | < 1 kB each | |
| **Total Routes** | **45.14 kB** | |

## Cache Efficiency Improvement

**Before:** Any code change invalidates entire 482 kB vendor bundle
**After:**
- App code changes: Only route chunks (~45 kB) invalidated
- Vendor code stable: 525 kB remains cached
- Cache hit rate improvement: ~92% of bundle stays cached on app updates

## Initial Load Strategy

index.html uses `<link rel="modulepreload">` for all vendor chunks:
```html
<script type="module" src="/assets/index-*.js"></script>
<link rel="modulepreload" href="/assets/vendor-react-*.js">
<link rel="modulepreload" href="/assets/vendor-other-*.js">
<link rel="modulepreload" href="/assets/vendor-tanstack-*.js">
<link rel="modulepreload" href="/assets/vendor-zustand-*.js">
<link rel="modulepreload" href="/assets/vendor-radix-*.js">
```

## Commits

1. `cbdb59a` - feat(03-01): configure manualChunks for vendor splitting

## Verification Results

- [x] Build succeeds (`pnpm build` exits 0)
- [x] Vendor chunks exist (5 vendor-*.js files)
- [x] Route chunks preserved (10 _auth*.js files)
- [x] Bundle analyzer available (stats.html 1.3 MB)
- [x] No duplication (route chunks contain 0 vendor code)
- [x] Chunk size warnings only for expected large chunks

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] pnpm nested node_modules path handling**
- **Found during:** Task 1
- **Issue:** Original manualChunks function didn't handle pnpm's `.pnpm/pkg@version/node_modules/pkg` path structure
- **Fix:** Modified manualChunks to split on last `node_modules/` segment instead of first
- **Files modified:** apps/shell/vite.config.ts
- **Commit:** cbdb59a

**2. [Rule 2 - Missing Critical] Include scheduler in vendor-react**
- **Found during:** Task 1 verification
- **Issue:** React's scheduler dependency was going to vendor-other instead of vendor-react
- **Fix:** Added scheduler to vendor-react chunk condition
- **Rationale:** scheduler is React runtime dependency, should cache together
- **Commit:** cbdb59a

## Technical Notes

- pnpm uses a unique flat node_modules structure with symlinks
- Actual module paths look like: `node_modules/.pnpm/react@19.2.3/node_modules/react/...`
- The manualChunks function must extract package name from the last `node_modules/` segment
- visualizer plugin must be added after other plugins to capture accurate stats
