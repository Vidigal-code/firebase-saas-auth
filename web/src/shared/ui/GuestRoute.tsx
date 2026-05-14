import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { PageLoader } from './PageLoader';

const DASHBOARD_PATH = '/connections';

export const GuestRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isInitialized } = useCurrentUser();

  if (!isInitialized) return <PageLoader minHeight="100vh" />;

  if (isAuthenticated) {
    return <Navigate to={DASHBOARD_PATH} replace />;
  }

  return children;
};
