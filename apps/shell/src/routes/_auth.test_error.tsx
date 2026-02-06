import { MfeErrorBoundary } from '@/components/error-boundary/MfeErrorBoundary';
import { RouteErrorBoundary } from '@/components/error-boundary/RouteErrorBoundary';
import { createFileRoute } from '@tanstack/react-router';
import { ErrorTester } from '@/components/error-boundary/ErrorTester';
import { ComponentErrorFallback } from '@/components/error-boundary/ComponentErrorFallback';

export const Route = createFileRoute('/_auth/test_error')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RouteErrorBoundary routeName="Test Error Page">
      <MfeErrorBoundary
        mfeName="Broken Component in Test Error Page"
        FallbackComponent={ComponentErrorFallback}
        // fallback={
        //   <ComponentErrorFallback
        //     error={new Error('Component failed')}
        //     resetErrorBoundary={() => window.location.reload()}
        //   />
        // }
      >
        <div className="min-h-40 border-sky-200 border-2 rounded-lg p-4 mb-6 flex flex-col items-center justify-center">
          <p className="text-gray-700 text-lg font-medium text-center">This is Component 1</p>
          <ErrorTester level="component" />
        </div>
      </MfeErrorBoundary>

      <MfeErrorBoundary mfeName="Component B in Test Error Page">
        <div className="flex items-center justify-center border-amber-200 border-2 rounded-lg p-4 mb-6 ">
          <p className="text-gray-700 text-lg font-medium">
            This is Error Boundary Test Page (This is Component 2)
          </p>
        </div>
      </MfeErrorBoundary>
    </RouteErrorBoundary>
  );
}
