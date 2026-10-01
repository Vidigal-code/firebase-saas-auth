import { useMemo } from 'react';
import type { ConnectionScope } from '@/shared/domain/scope';
import { useCurrentUser } from './useSession';

export const useConnectionScope = (connectionId: string): ConnectionScope => {
  const { uid } = useCurrentUser();
  return useMemo(() => ({ clientId: uid, connectionId }), [uid, connectionId]);
};
