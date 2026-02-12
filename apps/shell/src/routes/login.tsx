import { createFileRoute, redirect } from '@tanstack/react-router';

import { LoginPage } from '@/pages/LoginPage';

const fallback = '/dashboard' as const;
type LoginSearch = {
  redirect?: string;
};

export const Route = createFileRoute('/login')({
  validateSearch: (search): LoginSearch => {
    return {
      redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
    };
  },
  beforeLoad: ({ context, search }) => {
    if (context?.auth?.isLoggedIn) {
      throw redirect({ to: search?.redirect || fallback });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <LoginPage />;
}
