import { useMemo } from 'react';
import { where } from '@/shared/lib/firestore';
import { useFirestoreCollection } from '@/shared/hooks/useFirestoreCollection';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';

export interface Connection {
  id: string;
  clientId: string;
  name: string;
  createdAt: string;
}

export const useConnections = () => {
  const { uid } = useCurrentUser();

  const constraints = useMemo(
    () => (uid ? [where('clientId', '==', uid)] : []),
    [uid],
  );

  const { data, loading } = useFirestoreCollection<Connection>(
    'connections',
    constraints,
    !!uid,
  );

  return { connections: data, loading };
};
