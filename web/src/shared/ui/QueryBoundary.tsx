import type { ReactNode } from 'react';
import type { RealtimeStatus } from '@/shared/firebase/useRealtimeQuery';
import { LoadError } from './LoadError';
import { PageLoader } from './PageLoader';

export interface QueryBoundaryProps {
  status: RealtimeStatus;
  children: ReactNode;
}

export const QueryBoundary = ({ status, children }: Readonly<QueryBoundaryProps>) => {
  if (status === 'loading') return <PageLoader />;
  if (status === 'error') return <LoadError />;
  return <>{children}</>;
};
