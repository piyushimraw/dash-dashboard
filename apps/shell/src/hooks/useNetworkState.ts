import { useSyncExternalStore } from 'react';

/**
 * Subscribes to browser online/offline events.
 * Uses useSyncExternalStore for React 18+ concurrent mode compatibility.
 */
function subscribe(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  // On server, assume online
  return true;
}

/**
 * Hook that returns current network connectivity status.
 * Updates reactively when browser goes online/offline.
 *
 * Note: navigator.onLine can have false positives (connected to network
 * but no internet). For more accurate detection, combine with React Query's
 * fetchStatus === 'paused'.
 *
 * @returns boolean - true if online, false if offline
 */
export function useNetworkState(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
