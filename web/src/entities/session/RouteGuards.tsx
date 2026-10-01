import { Navigate, Outlet, useLocation } from 'react-router';
import { ROUTES } from '@/shared/config/routes';
import { PageLoader } from '@/shared/ui/PageLoader';
import { useSession } from './useSession';

export interface RedirectState {
  from?: string;
}

export const RequireAuth = () => {
  const session = useSession();
  const location = useLocation();

  if (session.status === 'loading') return <PageLoader />;
  if (session.status === 'anonymous') {
    const state: RedirectState = { from: location.pathname };
    return <Navigate to={ROUTES.login} state={state} replace />;
  }
  return <Outlet />;
};

export const RequireGuest = () => {
  const session = useSession();
  const location = useLocation();
  const { from } = (location.state ?? {}) as RedirectState;

  if (session.status === 'loading') return <PageLoader />;
  if (session.status === 'authenticated') return <Navigate to={from ?? ROUTES.connections} replace />;
  return <Outlet />;
};
