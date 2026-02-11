import { createFileRoute } from '@tanstack/react-router';

import Unauthorized from '@/pages/UnAuthorized';

export const Route = createFileRoute('/unauthorized')({
  component: Unauthorized,
});
