import { useSyncExternalStore, useState, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const DISMISSED_KEY = 'pwa-install-dismissed';

/**
 * Check if dev mode force-show is enabled via ?pwa-test query param.
 * Called inside hook to ensure it's checked on each render.
 */
function isDevModeForceShow(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.search.includes('pwa-test');
}

// Module-scope variable to store deferred prompt
let deferredPrompt: BeforeInstallPromptEvent | null = null;

/**
 * Subscribes to beforeinstallprompt and appinstalled events.
 * Uses useSyncExternalStore for React 18+ concurrent mode compatibility.
 */
function subscribe(callback: () => void) {
  const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
    e.preventDefault();
    deferredPrompt = e;
    callback();
  };

  const handleAppInstalled = () => {
    deferredPrompt = null;
    // Clear session dismissal when app is installed
    sessionStorage.removeItem(DISMISSED_KEY);
    callback();
  };

  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  window.addEventListener('appinstalled', handleAppInstalled);

  return () => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.removeEventListener('appinstalled', handleAppInstalled);
  };
}

function getSnapshot() {
  return deferredPrompt !== null;
}

function getServerSnapshot() {
  // On server, install prompt not available
  return false;
}

/**
 * Detects if app is running in standalone mode (already installed).
 * Checks both standard display-mode and iOS-specific property.
 */
function isStandaloneMode(): boolean {
  // Standard PWA standalone detection
  if (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  // iOS-specific standalone detection
  if (typeof navigator !== 'undefined' && 'standalone' in navigator) {
    return (navigator as any).standalone === true;
  }

  return false;
}

/**
 * Hook that manages PWA installation prompt state.
 * Uses useSyncExternalStore for reactive subscription to install events.
 * Dismissal is session-scoped (clears on browser close).
 *
 * @returns Object with install state and control functions
 */
export function usePWAInstall() {
  const canInstall = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isStandalone = isStandaloneMode();

  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem(DISMISSED_KEY) === 'true';
  });

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      return { outcome: 'dismissed' as const };
    }

    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    if (result.outcome === 'accepted') {
      deferredPrompt = null;
      sessionStorage.removeItem(DISMISSED_KEY);
      setIsDismissed(false);
    }

    return result;
  }, []);

  const dismiss = useCallback(() => {
    setIsDismissed(true);
    sessionStorage.setItem(DISMISSED_KEY, 'true');
  }, []);

  // Show banner if install prompt available OR in dev test mode (via ?pwa-test query param)
  const devForceShow = isDevModeForceShow();
  const showBanner = (canInstall || devForceShow) && !isStandalone && !isDismissed;

  return {
    canInstall,
    isStandalone,
    isDismissed,
    promptInstall,
    dismiss,
    showBanner,
  };
}
