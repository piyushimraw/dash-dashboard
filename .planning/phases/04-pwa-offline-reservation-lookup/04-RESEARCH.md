# Phase 4: PWA & Offline Support - Research

**Researched:** 2026-01-23
**Domain:** Progressive Web Apps (PWA), Service Workers, Offline-First Architecture
**Confidence:** HIGH

## Summary

This phase adds full PWA and offline support specifically to the Reservation Lookup MFE (mfe-reservation-lookup) within a build-time microfrontend architecture. The shell application already has `vite-plugin-pwa` configured with basic PWA functionality (manifest, service worker registration, install prompts), but offline support requires additional implementation: React Query cache persistence to IndexedDB, proper service worker caching strategies for API requests, and offline-aware query configuration.

The standard approach for React + Vite PWAs in 2026 combines three technologies:
1. **vite-plugin-pwa** (with Workbox) for service worker generation and asset caching
2. **TanStack Query persistence** with IndexedDB for server-state caching
3. **React Query's `networkMode: 'offlineFirst'`** to integrate with service worker cache layer

The Reservation Lookup MFE is a data-heavy read-only table view that fetches reservation data via React Query, making it an ideal candidate for offline support. Users can view previously loaded reservations when offline, with graceful degradation for features requiring network connectivity.

**Primary recommendation:** Use `generateSW` strategy with runtime caching for API endpoints, persist React Query cache to IndexedDB using `idb-keyval`, and configure queries with `networkMode: 'offlineFirst'` to work seamlessly with the service worker cache layer.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vite-plugin-pwa | 1.2.0 | PWA manifest + service worker generation | Zero-config PWA for Vite, industry standard with 7.8k+ GitHub stars, built-in Workbox integration |
| workbox-* | 7.3.0+ | Service worker runtime strategies | Google's official PWA library, manages caching strategies and background sync, bundled with vite-plugin-pwa |
| @tanstack/react-query-persist-client | ^5.90.0 | React Query cache persistence | Official TanStack Query plugin for persisting cache to storage |
| idb-keyval | 6.2.2 | IndexedDB key-value wrapper | Ultra-lightweight (573 bytes), promise-based, perfect for simple cache persistence, maintained by Jake Archibald (Google) |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| idb | ^8.0.0 | Full IndexedDB wrapper | Only if complex database operations needed (custom queries, indexes, cursors) - not needed for basic cache persistence |
| workbox-window | 7.3.0+ | Service worker lifecycle management | Advanced SW update control, progress tracking - only if custom update UI needed beyond vite-plugin-pwa defaults |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| generateSW | injectManifest | More control over service worker code, but requires manual Workbox configuration and maintenance. Use only if custom SW logic needed beyond standard caching |
| idb-keyval | localStorage | localStorage simpler but 5-10MB limit, synchronous (blocks UI), string-only. IndexedDB is async, 100s of MB, structured data |
| idb-keyval | idb | `idb` provides full database features (1.19kB) but overkill for simple cache persistence. `idb-keyval` (573 bytes) sufficient for React Query persister |

**Installation:**
```bash
# Core dependencies (vite-plugin-pwa already installed)
pnpm add @tanstack/react-query-persist-client idb-keyval

# Optional: if custom service worker needed
# pnpm add workbox-window
```

## Architecture Patterns

### Recommended Project Structure

```
apps/shell/
├── src/
│   ├── lib/
│   │   └── queryPersister.ts    # IndexedDB persister for React Query
│   ├── sw/                       # Only if using injectManifest
│   │   └── service-worker.ts
│   └── main.tsx                  # PersistQueryClientProvider setup
├── public/
│   └── offline.html              # Fallback offline page
└── vite.config.ts                # PWA plugin configuration

apps/mfe-reservation-lookup/
├── src/
│   └── features/
│       └── rent-vehicle/
│           └── query.ts          # Configure networkMode: 'offlineFirst'
```

### Pattern 1: Service Worker Asset Caching (Precache)

**What:** Static assets (JS, CSS, HTML, images) are cached during service worker installation for instant offline loading.

**When to use:** Always for PWA offline support - this is the foundation.

**Example:**
```typescript
// apps/shell/vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'pwa-192x192.png', 'pwa-512x512.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
      },
      manifest: {
        name: 'Hertz Dashboard',
        short_name: 'Hertz',
        description: 'Car Rental Management Dashboard',
        theme_color: '#ffffff',
        icons: [/* ... */],
      },
    }),
  ],
});
```

### Pattern 2: API Request Runtime Caching

**What:** Network requests to API endpoints are cached at runtime using Workbox strategies.

**When to use:** For offline data access - cache API responses so users can view previously loaded data when offline.

**Example:**
```typescript
// apps/shell/vite.config.ts - Add to workbox config
workbox: {
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.example\.com\/.*$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24, // 24 hours
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
  navigateFallback: '/index.html',
  navigateFallbackDenylist: [/^\/api\//],
}
```

**Workbox Caching Strategies:**
- **NetworkFirst:** Try network, fall back to cache (good for API data that changes)
- **CacheFirst:** Try cache, fall back to network (good for immutable assets)
- **StaleWhileRevalidate:** Serve cached, update in background (balance speed/freshness)

### Pattern 3: React Query Persistence to IndexedDB

**What:** Persist React Query cache to IndexedDB so data survives page reloads and is available offline.

**When to use:** Essential for offline data viewing - without this, cache resets on reload.

**Example:**
```typescript
// apps/shell/src/lib/queryPersister.ts
import { get, set, del } from 'idb-keyval';
import type { PersistedClient, Persister } from '@tanstack/react-query-persist-client';

export function createIDBPersister(idbValidKey: IDBValidKey = 'reactQuery') {
  return {
    persistClient: async (client: PersistedClient) => {
      await set(idbValidKey, client);
    },
    restoreClient: async () => {
      return await get<PersistedClient>(idbValidKey);
    },
    removeClient: async () => {
      await del(idbValidKey);
    },
  } satisfies Persister;
}
```

```typescript
// apps/shell/src/main.tsx
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createIDBPersister } from './lib/queryPersister';

const persister = createIDBPersister();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{
      persister,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      dehydrateOptions: {
        shouldDehydrateQuery: (query) => {
          // Only persist successful queries
          return query.state.status === 'success';
        },
      },
    }}
  >
    <App />
  </PersistQueryClientProvider>
);
```

### Pattern 4: Offline-First Query Configuration

**What:** Configure React Query with `networkMode: 'offlineFirst'` so queries fire even when offline, allowing service worker to intercept and serve cached responses.

**When to use:** Required when using service worker caching with React Query - ensures queries trigger fetch requests that SW can intercept.

**Example:**
```typescript
// packages/api-client/src/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst', // Allow SW to intercept offline
      staleTime: 5 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000, // Must be >= persistQueryClient maxAge
      retry: 1,
    },
  },
});
```

```typescript
// apps/mfe-reservation-lookup/src/features/rent-vehicle/query.ts
export const useGetRentedVehicleList = () =>
  useQuery({
    queryKey: queryKeys.rentedVehicles.all,
    queryFn: getRentedVehicleList,
    networkMode: 'offlineFirst', // Or set globally in queryClient
  });
```

### Pattern 5: Offline Fallback Page

**What:** Custom offline.html page shown when user navigates to uncached routes while offline.

**When to use:** Always - provides better UX than browser's default "no internet" error.

**Example:**
```html
<!-- apps/shell/public/offline.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline - Hertz Dashboard</title>
  <style>
    body { font-family: system-ui; text-align: center; padding: 50px; }
    .icon { font-size: 64px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="icon">📡</div>
  <h1>You're Offline</h1>
  <p>Some features require an internet connection.</p>
  <p>Your previously viewed data is available below.</p>
  <button onclick="window.history.back()">Go Back</button>
</body>
</html>
```

### Anti-Patterns to Avoid

- **Caching everything:** Don't cache all API responses - be selective. Large datasets or frequently changing data should not be cached long-term. Causes quota issues and stale data.
- **Not cleaning up old caches:** Set `cleanupOutdatedCaches: true` and configure cache expiration. Old caches accumulate and consume browser storage quota.
- **Ignoring cache quota:** Browser storage limits are 20-60% of free disk space per origin. Use `navigator.storage.estimate()` to monitor usage. Implement cache eviction strategy.
- **Blocking mutations offline:** Don't prevent mutations when offline. Queue them with Workbox Background Sync for retry when online.
- **Missing networkMode config:** Without `networkMode: 'offlineFirst'`, React Query won't fire requests when offline, preventing service worker from serving cached responses.
- **Synchronous storage (localStorage):** Never use localStorage for cache persistence - it blocks the UI thread. Always use IndexedDB (async).

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Service worker lifecycle | Custom SW registration/update logic | vite-plugin-pwa with `registerType: 'autoUpdate'` | Handles registration, updates, skip waiting, clients claim. Manual SW lifecycle is complex with edge cases. |
| Cache versioning | Manual cache key management | Workbox `cleanupOutdatedCaches: true` | Automatically removes old cache versions. Manual cleanup is error-prone. |
| Network retry logic | Custom exponential backoff | Workbox Background Sync API | Browsers handle retry timing with exponential backoff. Custom retry logic duplicates browser behavior. |
| IndexedDB transactions | Raw IndexedDB API | idb-keyval or idb | Raw IndexedDB is callback-based, verbose, error-prone. Wrappers provide promises, simpler API. |
| Offline detection | `navigator.onLine` checks | React Query `fetchStatus` + networkMode | `navigator.onLine` is unreliable (false positives in Chrome). Query `fetchStatus: 'paused'` is accurate. |
| Request deduplication | Manual request tracking | React Query built-in | Query already deduplicates identical requests. Don't re-implement. |

**Key insight:** Service worker APIs are low-level and complex. Workbox provides battle-tested abstractions. vite-plugin-pwa configures Workbox correctly for Vite builds. Don't bypass these layers unless you have specific requirements they can't satisfy.

## Common Pitfalls

### Pitfall 1: Safari 7-Day Cache Eviction

**What goes wrong:** Safari evicts all service worker caches after 7 days of no user interaction with the site. Users lose offline data unexpectedly.

**Why it happens:** Safari's privacy-focused cache policy to prevent persistent tracking. Applies to Cache API, IndexedDB, service worker registration.

**How to avoid:**
- Add PWA to home screen - installed PWAs are exempt from 7-day eviction
- Show "Add to Home Screen" prompt on iOS
- Document limitation for Safari users who don't install

**Warning signs:** Users report offline functionality works initially but stops after a week.

### Pitfall 2: Service Worker Scope in MFE Architecture

**What goes wrong:** Service worker registered at shell scope controls all MFEs, but individual MFEs might try to register their own service workers, causing conflicts.

**Why it happens:** In MFE architectures, each MFE might independently try to add PWA support, not realizing shell already handles it.

**How to avoid:**
- Register service worker ONLY in shell application
- MFEs should never register their own service workers
- Document in ARCHITECTURE.md that PWA support is shell-owned
- Use event bus to communicate SW state to MFEs if needed

**Warning signs:** Multiple service workers registered, conflicting cache strategies, `DOMException: Failed to register a ServiceWorker`.

### Pitfall 3: Cache Quota Exceeded

**What goes wrong:** App hits browser storage quota, throwing `QuotaExceededError`. Caching stops working, users can't store new data.

**Why it happens:** Aggressive caching without expiration limits. Chrome allows ~20% of disk space per origin, but filling it causes issues.

**How to avoid:**
- Set `maxEntries` and `maxAgeSeconds` on all runtime caches
- Monitor storage: `await navigator.storage.estimate()`
- Implement cache cleanup: `cleanupOutdatedCaches: true`
- Don't cache large responses (videos, large PDFs)

**Warning signs:** `QuotaExceededError` in console, IndexedDB write failures, users report "app doesn't work after using for a while".

### Pitfall 4: Mutation Serialization in IndexedDB

**What goes wrong:** React Query mutations fail to persist to IndexedDB because `mutationFn` (a function) cannot be serialized.

**Why it happens:** IndexedDB uses structured clone algorithm which can't serialize functions. TanStack Query persistence docs warn about this.

**How to avoid:**
- Don't persist mutations: `shouldDehydrateMutation: () => false` (default)
- If offline mutations needed, use Workbox Background Sync to queue failed POST/PUT requests
- React Query handles mutation state separately from query cache

**Warning signs:** Mutations work but aren't retried after reload, console warnings about serialization.

### Pitfall 5: Stale Data After Network Recovery

**What goes wrong:** User goes offline, views cached data, comes back online, but still sees old data. Fresh data not fetched.

**Why it happens:** `NetworkFirst` strategy with long cache expiration + React Query's `staleTime` = data never refetches.

**How to avoid:**
- Use `StaleWhileRevalidate` for data that should update in background
- Keep React Query `staleTime` shorter than cache expiration
- Set `refetchOnReconnect: true` in query options
- Listen to `window.online` event to invalidate queries

**Warning signs:** Users complain data is outdated after being offline, manual refresh required.

### Pitfall 6: HTTPS Requirement

**What goes wrong:** Service workers don't register, PWA features don't work. Browser shows "Service Worker registration failed".

**Why it happens:** Service workers require HTTPS (except localhost). HTTP sites can't use SW for security reasons.

**How to avoid:**
- Development: Use `localhost` (HTTPS not required)
- Production: Deploy with HTTPS (required)
- Check `vite.config.ts` `devOptions.enabled: true` for local SW testing

**Warning signs:** Works on localhost but fails in production on HTTP, console error "Service Worker registration failed: SecurityError".

## Code Examples

Verified patterns from official sources:

### Complete vite-plugin-pwa Configuration

```typescript
// Source: https://vite-pwa-org.netlify.app/workbox/generate-sw
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true, // Enable SW in dev mode for testing
        type: 'module',
      },
      includeAssets: ['favicon.svg', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'Hertz Dashboard',
        short_name: 'Hertz',
        description: 'Car Rental Management Dashboard',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        // Precache static assets
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],

        // Runtime caching for API requests
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.example\.com\/reservations.*$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'reservations-api',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
              networkTimeoutSeconds: 10, // Fall back to cache after 10s
            },
          },
        ],

        // Cleanup old caches automatically
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,

        // Offline fallback
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//], // Don't fallback for API routes
      },
    }),
  ],
});
```

### React Query Persister Setup

```typescript
// Source: https://tanstack.com/query/v5/docs/framework/react/plugins/persistQueryClient
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createIDBPersister } from './lib/queryPersister';
import { queryClient } from '@packages/api-client';

const persister = createIDBPersister('hertz-dashboard-cache');

function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            const isSuccess = query.state.status === 'success';
            const hasData = query.state.data !== undefined;
            return isSuccess && hasData;
          },
        },
      }}
    >
      {/* Your app */}
    </PersistQueryClientProvider>
  );
}
```

### Offline Status UI Component

```typescript
// Source: https://tkdodo.eu/blog/offline-react-query
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useNetworkState } from './hooks/useNetworkState';

export function OfflineIndicator() {
  const isOnline = useNetworkState();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const showOffline = !isOnline && (isFetching > 0 || isMutating > 0);

  if (!showOffline) return null;

  return (
    <div className="offline-banner">
      📡 You're offline. Showing cached data.
    </div>
  );
}

// Hook to detect online/offline
function useNetworkState() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
```

### Storage Quota Monitoring

```typescript
// Source: https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
async function checkStorageQuota() {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const { usage, quota } = await navigator.storage.estimate();
    const percentUsed = Math.round((usage! / quota!) * 100);

    console.log(`Storage: ${usage} / ${quota} bytes (${percentUsed}%)`);

    if (percentUsed > 80) {
      console.warn('Storage quota nearly full. Consider clearing old caches.');
    }

    return { usage, quota, percentUsed };
  }
  return null;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `registerType: 'prompt'` | `registerType: 'autoUpdate'` | Workbox 6+ (2021) | Auto-updates SW without user prompt, better UX. Prompt mode caused "Update available" banner fatigue. |
| React Query v3 `cacheTime` | React Query v5 `gcTime` | TanStack Query v5 (2024) | Renamed for clarity - "garbage collection time" more accurate than "cache time". Must match persister `maxAge`. |
| `navigator.onLine` checks | React Query `networkMode` + `fetchStatus` | React Query v4 (2022) | `navigator.onLine` unreliable in Chrome (false positives). Query `fetchStatus: 'paused'` accurate. |
| Manual IndexedDB | idb-keyval wrapper | Ongoing | Raw IndexedDB API is callback-based, verbose. Promise-based wrappers are standard in 2026. |
| Runtime module federation for MFE | Build-time federation | Project decision | Simpler ops, single deployment, better for offline (all code cached at install). |

**Deprecated/outdated:**
- **Workbox v5/v6:** Use Workbox 7+ (bundled with vite-plugin-pwa 1.2.0). v6 support ended.
- **React Query v3 persistence:** Use v5 `@tanstack/react-query-persist-client` package. v3 had different API.
- **LocalStorage for cache:** Never use - synchronous, blocks UI, 5-10MB limit. IndexedDB is standard.
- **`workbox-window` for basic PWA:** Only needed for custom SW lifecycle control. vite-plugin-pwa handles common cases.

## Open Questions

Things that couldn't be fully resolved:

1. **API Endpoint URLs for Runtime Caching**
   - What we know: Need to configure `runtimeCaching` urlPattern for reservation API
   - What's unclear: Actual API base URL and endpoints (not in codebase yet - mocked data?)
   - Recommendation: During planning, identify API endpoints that Reservation Lookup calls. Configure `runtimeCaching` patterns to match those URLs.

2. **Offline Mutation Handling**
   - What we know: Reservation Lookup is currently read-only (table view with filters)
   - What's unclear: Will users need to create/update reservations offline in future?
   - Recommendation: Phase 4 focuses on read-only offline support (viewing cached data). If offline mutations needed later, add Workbox Background Sync in separate phase.

3. **Cache Storage Quota Strategy**
   - What we know: Browsers provide 20-60% of disk space per origin, but actual quota varies by user's disk space
   - What's unclear: Expected data volume for Reservation Lookup (how many reservations, how big are responses?)
   - Recommendation: Start with conservative `maxEntries: 50` for API cache. Monitor with `navigator.storage.estimate()`. Adjust based on actual usage.

4. **MFE-Specific Offline Behavior**
   - What we know: Shell owns service worker registration, all MFEs share same SW
   - What's unclear: Should each MFE have different offline capabilities, or unified experience?
   - Recommendation: Phase 4 proves offline pattern with Reservation Lookup. Success criteria should guide rolling out to other MFEs in future phases.

## Sources

### Primary (HIGH confidence)

- [Vite Plugin PWA Documentation](https://vite-pwa-org.netlify.app/guide/development) - Official plugin docs, configuration reference
- [Workbox Generate SW](https://vite-pwa-org.netlify.app/workbox/generate-sw) - Runtime caching configuration
- [MDN: Offline and Background Operation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation) - Service worker fundamentals, caching strategies
- [TanStack Query persistQueryClient](https://tanstack.com/query/v5/docs/framework/react/plugins/persistQueryClient) - Official persistence plugin docs
- [Offline React Query by TkDodo](https://tkdodo.eu/blog/offline-react-query) - Official React Query maintainer's guide to offline support
- [MDN: Storage Quotas](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) - Browser storage limits by vendor
- [Chrome Developers: Workbox Background Sync](https://developer.chrome.com/docs/workbox/modules/workbox-background-sync) - Official Workbox docs
- [idb-keyval GitHub](https://github.com/jakearchibald/idb-keyval) - Official repository, API reference

### Secondary (MEDIUM confidence)

- [CSS-Tricks: Using VitePWA Plugin](https://css-tricks.com/vitepwa-plugin-offline-service-worker/) - Tutorial on vite-plugin-pwa usage
- [Microfrontend.dev: Service Workers](https://microfrontend.dev/web-standards/micro-frontends-service-workers/) - Service worker scope in MFE architectures
- [LogRocket: Offline Storage for PWAs](https://blog.logrocket.com/offline-storage-for-pwas/) - Storage options comparison
- [Web.dev: Service Workers](https://web.dev/learn/pwa/service-workers) - Google's PWA training materials
- [Testing Service Worker | Vite PWA](https://vite-pwa-org.netlify.app/guide/testing-service-worker) - Testing approaches for PWA

### Tertiary (LOW confidence)

- [Medium: Build PWA with Vue 3 and Vite 2025](https://medium.com/@Christopher_Tseng/build-a-blazing-fast-offline-first-pwa-with-vue-3-and-vite-in-2025-the-definitive-guide-5b4969bc7f96) - Similar tech stack, community tutorial
- [Debugging PWAs: Common Pitfalls](https://blog.pixelfreestudio.com/debugging-progressive-web-apps-common-pitfalls/) - Community article on pitfalls

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified via official docs and npm registry. Versions confirmed current (Jan 2026).
- Architecture: HIGH - Patterns verified via official Vite PWA docs, TanStack Query docs, MDN. Code examples sourced from official documentation.
- Pitfalls: MEDIUM-HIGH - Mix of official warnings (quota limits, Safari eviction, mutation serialization from official docs) and community-reported issues (MFE scope conflicts, stale data). All cross-referenced with official sources where possible.

**Research date:** 2026-01-23
**Valid until:** 2026-04-23 (90 days - stable technology stack, slow-moving standards)

**Notes:**
- vite-plugin-pwa 1.2.0 is latest as of research date, compatible with Vite 7.3.1 (currently installed)
- Shell application already has basic PWA setup (vite.config.ts lines 21-49) - this phase extends with offline data support
- Reservation Lookup MFE is read-only (no mutations), simplifying offline implementation
- MFE architecture requires service worker owned by shell, not individual MFEs
