import { get, set, del } from 'idb-keyval';
import type { PersistedClient, Persister } from '@tanstack/react-query-persist-client';

/**
 * Creates an IndexedDB-backed persister for React Query cache.
 * Uses idb-keyval for async, promise-based IndexedDB access.
 *
 * @param idbValidKey - The key used to store the cache in IndexedDB (default: 'hertz-query-cache')
 * @returns Persister object compatible with PersistQueryClientProvider
 */
export function createIDBPersister(idbValidKey: IDBValidKey = 'hertz-query-cache'): Persister {
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
  };
}
