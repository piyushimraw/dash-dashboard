import { createFileRoute } from '@tanstack/react-router';

import { ErrorTester } from '@/components/error-boundary/ErrorTester';
import { RouteErrorBoundary } from '@/components/error-boundary/RouteErrorBoundary';

export const Route = createFileRoute('/_auth/broken_component')({
  component: BrokenComponent,
});

function BrokenComponent() {
  return (
    <RouteErrorBoundary routeName="Broken Component">
      <div className="w-full h-full flex flex-col items-center justify-center px-4 py-6">
        {/* <p className="text-gray-700 text-lg font-medium">This is a Test Page</p> */}
        <ErrorTester level="route" />
      </div>
    </RouteErrorBoundary>
  );
}
