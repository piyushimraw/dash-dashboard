import { Link } from '@tanstack/react-router';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900">Access Denied</h1>

        <p className="text-sm text-gray-600">You do not have permission to access this page.</p>

        <p className="text-sm text-gray-500">
          Please contact your administrator if you believe this is a mistake.
        </p>

        <Link
          to="/dashboard"
          className="inline-block mt-4 text-sm font-medium text-blue-600 hover:underline"
        >
          Go back to Dashboard
        </Link>
      </div>
    </div>
  );
}
