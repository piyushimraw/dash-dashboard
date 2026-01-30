import { QueryClient } from "@tanstack/react-query";
import { handleQueryError } from "./errorHandler";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst',
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 min
      gcTime: 24 * 60 * 60 * 1000, // 24 hours - must be >= persister maxAge
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
      onError: handleQueryError,
    },
  },
});
