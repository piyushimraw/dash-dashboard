import { render, type RenderResult } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Helper to render with React Query
export const renderWithQueryClient = (ui: React.ReactNode): RenderResult => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }, // avoid retries in tests
    },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};
