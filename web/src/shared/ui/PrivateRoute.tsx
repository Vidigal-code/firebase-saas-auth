import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { PageLoader } from './PageLoader';

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isInitialized } = useCurrentUser();
  const location = useLocation();

  if (!isInitialized) return <PageLoader minHeight="100vh" />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
