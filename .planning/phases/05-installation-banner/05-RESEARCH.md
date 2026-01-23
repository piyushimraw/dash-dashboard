# Phase 5: Installation Banner - Research

**Researched:** 2026-01-23
**Domain:** PWA Installation Prompt (beforeinstallprompt API)
**Confidence:** MEDIUM

## Summary

PWA installation banners rely on the `beforeinstallprompt` browser event to trigger native installation prompts. The standard pattern involves capturing this event, storing a reference, and calling its `prompt()` method from a user-triggered action (button click). Browser support is limited to Chromium-based browsers (Chrome, Edge, Samsung Internet) - Safari/iOS does not support this API.

The implementation uses React hooks (`useState`, `useEffect`) to manage the install prompt state, `window.matchMedia('(display-mode: standalone)')` to detect if already installed, and sessionStorage to track dismissals within a browser session. The existing codebase already uses `useSyncExternalStore` for network state management, providing a proven pattern for subscribing to browser events in React 18+.

Key challenges include the one-time-use limitation of `prompt()`, non-standard TypeScript types requiring custom type definitions, and graceful degradation for unsupported browsers.

**Primary recommendation:** Build a custom React hook using `useSyncExternalStore` to manage `beforeinstallprompt` event state, paired with a banner component that conditionally renders based on install availability, dismissal state, and display mode detection.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.0 | UI framework | Already in project, hooks pattern well-established |
| vite-plugin-pwa | 1.2.0 | PWA build tooling | Already configured, generates manifest and service worker |
| Native Web APIs | N/A | beforeinstallprompt, matchMedia | Browser-native, no library needed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Tailwind CSS | 4.1.18 | Styling including animations | Already in project, use for banner styling |
| TypeScript | 5.9.3 | Type safety | Already in project, requires custom BeforeInstallPromptEvent type |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom hook | react-pwa-install-prompt (npm) | Library abstracts complexity but adds dependency; custom hook gives full control and matches existing useNetworkState pattern |
| sessionStorage | localStorage | localStorage persists across sessions (wrong for this use case); sessionStorage clears on browser close (correct behavior per requirements) |
| useState + useEffect | useSyncExternalStore | useSyncExternalStore is more appropriate for subscribing to external event sources; matches existing useNetworkState implementation |

**Installation:**
```bash
# No additional dependencies needed - using native APIs
```

## Architecture Patterns

### Recommended Project Structure
```
apps/shell/src/
├── hooks/
│   ├── useNetworkState.ts         # Existing - network status
│   └── useInstallPrompt.ts        # NEW - install prompt state
└── components/
    └── InstallBanner.tsx           # NEW - installation banner UI

packages/ui/src/components/
└── (banner component could go here if reusable across apps)
```

### Pattern 1: Event Subscription Hook with useSyncExternalStore
**What:** React hook that subscribes to the `beforeinstallprompt` event and provides install state + prompt function
**When to use:** Managing browser events that fire outside React's lifecycle
**Example:**
```typescript
// Source: MDN + existing useNetworkState.ts pattern
import { useSyncExternalStore, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

function subscribe(callback: () => void) {
  const handler = (e: Event) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    callback();
  };

  window.addEventListener('beforeinstallprompt', handler);

  return () => {
    window.removeEventListener('beforeinstallprompt', handler);
    deferredPrompt = null;
  };
}

function getSnapshot() {
  return deferredPrompt !== null;
}

function getServerSnapshot() {
  return false; // Server-side, no install prompt available
}

export function useInstallPrompt() {
  const isAvailable = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null; // Reset - can only use once

    return outcome;
  }, []);

  return { isAvailable, promptInstall };
}
```

### Pattern 2: Standalone Mode Detection
**What:** CSS and JavaScript detection to hide install UI when already installed
**When to use:** Preventing install prompt from showing to users who already installed the PWA
**Example:**
```typescript
// Source: web.dev/learn/pwa/detection + Smashing Magazine
function isStandalone(): boolean {
  // Check display-mode media query (Android Chrome, Edge, etc.)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  // Check iOS standalone property
  if ('standalone' in window.navigator && window.navigator.standalone) {
    return true;
  }

  return false;
}

// CSS alternative for hiding elements
// @media (display-mode: standalone) {
//   .install-banner { display: none; }
// }
```

### Pattern 3: Session-Scoped Dismissal Tracking
**What:** Track banner dismissal in sessionStorage (clears when browser closes)
**When to use:** Respecting user's temporary dismissal without permanent storage
**Example:**
```typescript
// Source: Community pattern + requirements
const DISMISSAL_KEY = 'pwa-install-dismissed';

function isDismissed(): boolean {
  return sessionStorage.getItem(DISMISSAL_KEY) === 'true';
}

function setDismissed(): void {
  sessionStorage.setItem(DISMISSAL_KEY, 'true');
}

function clearDismissed(): void {
  sessionStorage.removeItem(DISMISSAL_KEY);
}
```

### Pattern 4: Slide-Up Animation with Tailwind
**What:** Fixed bottom banner with slide-up entrance animation
**When to use:** Drawing attention to install prompt without being jarring
**Example:**
```typescript
// Source: Tailwind CSS documentation + community patterns
// Define in tailwind.config.js theme.extend.keyframes:
const slideUp = {
  from: { transform: 'translate3d(0, 100%, 0)', opacity: '0' },
  to: { transform: 'translate3d(0, 0, 0)', opacity: '1' }
};

// Usage in component:
<div className="fixed bottom-0 left-0 right-0 z-50 animate-[slideUp_0.3s_ease-out]">
  {/* Banner content */}
</div>
```

### Anti-Patterns to Avoid
- **Calling prompt() multiple times:** The method only works once per event instance. Always reset `deferredPrompt` to null after calling prompt() and check if it exists before calling again.
- **Not preventing default:** Forgetting `e.preventDefault()` allows browser's default install UI to show, creating confusing duplicate prompts.
- **Showing banner in standalone mode:** Always check display mode before rendering install UI. Users who already installed don't need install prompts.
- **Using localStorage for dismissal:** localStorage persists permanently across sessions. Requirements specify "reappear on next session", requiring sessionStorage.
- **Prompting without user gesture:** Calling prompt() must happen in response to user interaction (button click). Calling it immediately on event capture will fail.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Type definitions for BeforeInstallPromptEvent | Custom incomplete types scattered across files | Single type definition in types.d.ts or hook file | TypeScript doesn't include this non-standard API; community has established type shape |
| Cross-browser event subscription | Complex cleanup and memory leak management | useSyncExternalStore pattern | React 18+ hook designed for external subscriptions, handles cleanup automatically, matches existing useNetworkState |
| Detecting PWA install status | Custom logic checking various browser properties | window.matchMedia('(display-mode: standalone)') + navigator.standalone fallback | Standard approach covers Chromium browsers and iOS; comprehensive and battle-tested |
| Animation timing | Custom JavaScript animation loops | Tailwind CSS animations with keyframes | Declarative, performant, matches existing codebase style |

**Key insight:** The beforeinstallprompt API is deceptively simple but has strict constraints (one-time use, user gesture requirement, browser-specific behavior). Using established patterns like useSyncExternalStore prevents subtle bugs around event cleanup and state synchronization.

## Common Pitfalls

### Pitfall 1: Forgetting prompt() is Single-Use
**What goes wrong:** After calling `prompt()` once, attempting to call it again (even on the same stored event) does nothing. Developers may store the event and try to reuse it after user dismisses.
**Why it happens:** The API is designed to require a fresh `beforeinstallprompt` event for each prompt attempt. Browser must re-evaluate install eligibility.
**How to avoid:**
- Set `deferredPrompt = null` immediately after calling `prompt()`
- Check `if (!deferredPrompt) return` before any prompt() call
- Wait for browser to fire new `beforeinstallprompt` event for retry
**Warning signs:** Install button stops working after first click; no error thrown but prompt doesn't appear.

### Pitfall 2: Browser Compatibility Assumptions
**What goes wrong:** Code works in Chrome desktop but fails silently in Safari, iOS, or Firefox. The `beforeinstallprompt` event never fires.
**Why it happens:** This API is non-standard and only implemented in Chromium-based browsers (Chrome, Edge, Samsung Internet). Safari/iOS has different PWA installation flow.
**How to avoid:**
- Always render install button conditionally based on event availability
- Initialize button as hidden (`isAvailable` state starts false)
- Provide fallback UI or instructions for iOS users if needed
- Test in multiple browsers during development
**Warning signs:** Install button never appears in non-Chromium browsers; console shows no errors.

### Pitfall 3: Race Condition with Display Mode Check
**What goes wrong:** Banner briefly flashes on screen even though app is already installed in standalone mode.
**Why it happens:** React component renders before JavaScript display-mode check completes, or CSS media query isn't applied fast enough.
**How to avoid:**
- Check `isStandalone()` synchronously before rendering banner
- Use CSS media query `@media (display-mode: standalone)` to hide banner
- Combine both JavaScript and CSS approaches for defense in depth
**Warning signs:** Banner appears for a split second then disappears; banner shows when opening PWA from home screen.

### Pitfall 4: Missing User Gesture Requirement
**What goes wrong:** Calling `prompt()` immediately when `beforeinstallprompt` fires has no effect. Browser silently ignores the call.
**Why it happens:** Security/UX requirement - browsers require install prompts to come from explicit user actions to prevent spam.
**How to avoid:**
- Only call `prompt()` from click handlers or other user-initiated events
- Store the event when it fires, show UI, wait for user to click
- Document this requirement clearly in code comments
**Warning signs:** `prompt()` is called but nothing happens; no native install dialog appears.

### Pitfall 5: TypeScript Type Errors
**What goes wrong:** TypeScript errors on `BeforeInstallPromptEvent` properties or `window.addEventListener('beforeinstallprompt', ...)` because types aren't in standard lib.
**Why it happens:** The API is non-standard and not included in TypeScript's DOM types.
**How to avoid:**
- Define `BeforeInstallPromptEvent` interface in hook file or global types.d.ts
- Cast event: `e as BeforeInstallPromptEvent` when accessing properties
- Add `// @ts-expect-error` comment if needed for addEventListener type
**Warning signs:** Red squiggles in editor; type errors during build; 'Property X does not exist on type Event'.

### Pitfall 6: Event Doesn't Fire After Manual Dismissal
**What goes wrong:** User dismisses browser's native install prompt (before you deferred it), and `beforeinstallprompt` doesn't fire again for a long time.
**Why it happens:** Browsers implement "cooldown periods" after dismissal to prevent prompt spam. Chrome may wait weeks before firing event again.
**How to avoid:**
- Always call `e.preventDefault()` immediately in event handler
- Never let browser's default install UI show if you want custom control
- Document behavior: once dismissed at browser level, out of your control
**Warning signs:** Event fires once, never again even after clearing storage; only reproducible after fresh browser profile.

### Pitfall 7: Dismissal State Not Cleared on Install
**What goes wrong:** User dismisses banner, then manually installs PWA via browser menu, but dismissal state remains in sessionStorage causing confusion on next session.
**Why it happens:** SessionStorage persists until browser closes, even though PWA is now installed.
**How to avoid:**
- Check standalone mode on every render, not just on mount
- Clear dismissal storage when detecting successful install
- Monitor `deferredPrompt.userChoice` and clear state if outcome is 'accepted'
**Warning signs:** Banner doesn't show after dismissal even though app was just installed; inconsistent behavior across sessions.

## Code Examples

Verified patterns from official sources:

### Complete Hook Implementation
```typescript
// Source: MDN + web.dev/learn/pwa/installation-prompt
import { useSyncExternalStore, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

function subscribe(callback: () => void) {
  const handler = (e: Event) => {
    e.preventDefault(); // Prevent browser's default install UI
    deferredPrompt = e as BeforeInstallPromptEvent;
    callback(); // Notify React of state change
  };

  window.addEventListener('beforeinstallprompt', handler);

  return () => {
    window.removeEventListener('beforeinstallprompt', handler);
    deferredPrompt = null;
  };
}

function getSnapshot(): boolean {
  return deferredPrompt !== null;
}

function getServerSnapshot(): boolean {
  return false; // No install prompt available server-side
}

/**
 * Hook that manages PWA installation prompt state.
 * Returns availability and function to trigger native install prompt.
 */
export function useInstallPrompt() {
  const isAvailable = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      console.warn('Install prompt not available');
      return null;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null; // Reset - can only use once
      return outcome;
    } catch (error) {
      console.error('Error showing install prompt:', error);
      deferredPrompt = null;
      return null;
    }
  }, []);

  return { isAvailable, promptInstall };
}
```

### Banner Component with All Requirements
```typescript
// Source: web.dev/articles/promote-install + requirements
import { useState, useEffect } from 'react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

const DISMISSAL_KEY = 'pwa-install-dismissed';

function isStandalone(): boolean {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }
  if ('standalone' in window.navigator && (window.navigator as any).standalone) {
    return true;
  }
  return false;
}

export function InstallBanner() {
  const { isAvailable, promptInstall } = useInstallPrompt();
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem(DISMISSAL_KEY) === 'true';
  });

  // Check if already in standalone mode
  const [isStandaloneMode] = useState(isStandalone);

  const handleInstall = async () => {
    const outcome = await promptInstall();
    if (outcome === 'accepted') {
      // Install accepted - banner will disappear on next render due to standalone mode
      sessionStorage.removeItem(DISMISSAL_KEY);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISSAL_KEY, 'true');
    setIsDismissed(true);
  };

  // Don't show if: not available, dismissed, or already installed
  if (!isAvailable || isDismissed || isStandaloneMode) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-blue-600 text-white px-4 py-3 shadow-lg animate-[slideUp_0.3s_ease-out]"
      role="dialog"
      aria-label="Install application prompt"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/pwa-192x192.png"
            alt=""
            className="w-10 h-10 rounded"
            aria-hidden="true"
          />
          <div>
            <p className="font-medium">Install app</p>
            <p className="text-sm text-blue-100">Works offline • Faster access</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleInstall}
            className="bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-blue-50 transition-colors"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="p-2 hover:bg-blue-700 rounded transition-colors"
            aria-label="Dismiss"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Tailwind Animation Configuration
```javascript
// Source: Tailwind CSS documentation
// In tailwind.config.js or tailwind.config.ts
export default {
  theme: {
    extend: {
      keyframes: {
        slideUp: {
          '0%': {
            transform: 'translate3d(0, 100%, 0)',
            opacity: '0'
          },
          '100%': {
            transform: 'translate3d(0, 0, 0)',
            opacity: '1'
          }
        }
      },
      animation: {
        slideUp: 'slideUp 0.3s ease-out'
      }
    }
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom event listeners with useState | useSyncExternalStore for external subscriptions | React 18 (2022) | Better concurrent mode support, automatic cleanup, prevents memory leaks |
| Permissive install prompts | User gesture requirement enforced | Chrome 76 (2019) | Must call prompt() from click handler, not automatically |
| localStorage for dismissal | sessionStorage for session-scoped tracking | N/A (pattern) | Aligns with user expectations - dismissal is temporary, not permanent |
| Manual TypeScript typing everywhere | Centralized BeforeInstallPromptEvent interface | N/A (pattern) | Single source of truth, easier maintenance |

**Deprecated/outdated:**
- **Global window event listeners without cleanup:** Modern React uses hooks with cleanup functions. Raw addEventListener without removeEventListener causes memory leaks in SPAs.
- **Prompt on page load without user action:** Browsers now block this; always require user gesture (click, tap).
- **Checking only matchMedia without iOS fallback:** iOS uses `navigator.standalone`; checking only display-mode media query misses iOS users.

## Open Questions

Things that couldn't be fully resolved:

1. **Browser-specific install eligibility timing**
   - What we know: `beforeinstallprompt` fires when browser determines app is installable (valid manifest, HTTPS, service worker registered)
   - What's unclear: Exact timing varies by browser; Chrome may delay minutes after criteria are met
   - Recommendation: Accept that timing is unpredictable; design banner to appear whenever event fires without assumptions about page lifecycle

2. **Icon asset requirements for banner preview**
   - What we know: Manifest already includes pwa-192x192.png and pwa-512x512.png in vite config
   - What's unclear: Whether these are the actual icons that will be used or if they need creation
   - Recommendation: During implementation, verify these icon files exist in public/ directory; create if missing

3. **React 19 useSyncExternalStore compatibility**
   - What we know: Project uses React 19.2.0; useSyncExternalStore was introduced in React 18
   - What's unclear: Any breaking changes or improvements in React 19 for this hook
   - Recommendation: Use the pattern as documented; React 19 maintains backward compatibility for this API

4. **Z-index layering with existing UI**
   - What we know: Banner should be fixed at bottom with z-50
   - What's unclear: Whether existing app components use high z-index values that might conflict
   - Recommendation: During implementation, test banner visibility across all routes; adjust z-index if conflicts found

## Sources

### Primary (HIGH confidence)
- [MDN: Window: beforeinstallprompt event](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeinstallprompt_event) - Official API documentation
- [MDN: BeforeInstallPromptEvent](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent) - Interface specification
- [web.dev: Installation prompt](https://web.dev/learn/pwa/installation-prompt) - Implementation guide and best practices
- [web.dev: Patterns for promoting PWA installation](https://web.dev/articles/promote-install) - UI patterns and timing recommendations
- [web.dev: Detection](https://web.dev/learn/pwa/detection) - Standalone mode detection methods
- Existing codebase: useNetworkState.ts - Established useSyncExternalStore pattern

### Secondary (MEDIUM confidence)
- [Smashing Magazine: Optimizing PWAs For Different Display Modes](https://www.smashingmagazine.com/2025/08/optimizing-pwas-different-display-modes/) - CSS patterns for hiding install UI
- [Tailwind CSS: Animation documentation](https://tailwindcss.com/docs/animation) - Official animation utilities
- [love2dev: Using Beforeinstallprompt](https://love2dev.com/blog/beforeinstallprompt/) - Community patterns and gotchas
- [DEV Community: Simplest React Hook for PWA install](https://dev.to/woile/simplest-react-hook-component-for-pwa-install-button-2die) - React implementation patterns

### Tertiary (LOW confidence)
- Various WebSearch results on sessionStorage patterns - Community practices not verified with official docs
- npm packages (react-pwa-install-prompt, react-pwa-install) - Alternatives but not evaluated in depth

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Native APIs well-documented; existing codebase provides clear technology choices
- Architecture: HIGH - useSyncExternalStore pattern proven in existing useNetworkState; MDN provides official examples
- Pitfalls: MEDIUM - Documented in official sources + community experience, but some edge cases discovered through trial/error
- CSS animations: MEDIUM - Tailwind documented but specific animation config requires project-specific tuning

**Research date:** 2026-01-23
**Valid until:** 2026-02-23 (30 days - stable Web API)

**Notes:**
- BeforeInstallPromptEvent is non-standard and Chromium-only; Safari/iOS support remains unavailable
- React 19 compatibility assumed based on React 18 API stability
- All code examples should be tested in target browsers during implementation
