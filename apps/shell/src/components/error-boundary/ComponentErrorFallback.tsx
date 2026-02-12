type FallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

export function ComponentErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const isDev = import.meta.env.DEV;

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <h3 className="text-sm font-semibold text-red-700">Something went wrong in Test Component</h3>

      <p className="mt-1 text-sm text-red-600">This section failed to load. You can try again.</p>

      {isDev && (
        <pre className="mt-2 max-h-32 overflow-auto rounded bg-white p-2 text-xs text-red-700">
          {error.message}
        </pre>
      )}

      <div className="mt-3 flex gap-2">
        <button
          onClick={resetErrorBoundary}
          className="rounded bg-red-600 px-3 py-1.5 text-sm text-white cursor-pointer"
        >
          Try again
        </button>

        <button
          onClick={() => window.location.reload()}
          className="rounded border px-3 py-1.5 text-sm cursor-pointer"
        >
          Reload page
        </button>
      </div>
    </div>
  );
}
