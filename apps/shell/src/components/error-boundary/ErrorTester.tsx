import { useState } from 'react';

export function ErrorTester({ level }: { level: 'component' | 'route' | 'app' }) {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error(`${level.toUpperCase()} level error triggered!`);
  }

  return (
    <div className="m-4 p-6 border-2 border-dashed border-sky-300 rounded-lg bg-sky-50 max-w-xl mx-auto flex flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-lg font-semibold text-sky-800">Error Tester — {level} level</h3>
        <span className="text-sm text-sky-600">Scoped: {level}</span>
      </div>
      <p className="mt-3 text-sm text-sky-700">
        Trigger a simulated error at the selected scope to test error boundaries and fallbacks.
      </p>
      <div className="mt-4">
        <button
          onClick={() => setShouldThrow(true)}
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <span>Trigger {level} Error</span>
        </button>
      </div>
    </div>
  );
}
