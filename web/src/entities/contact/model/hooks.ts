import { useMemo } from 'react';
import { where } from '@/shared/lib/firestore';
import { useFirestoreCollection } from '@/shared/hooks/useFirestoreCollection';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';

export interface Contact {
  id: string;
  clientId: string;
  connectionId: string;
  name: string;
  phone: string;
  createdAt: string;
}

export const useContacts = (connectionId: string) => {
  const { uid } = useCurrentUser();

  const constraints = useMemo(
    () =>
      uid && connectionId
        ? [where('clientId', '==', uid), where('connectionId', '==', connectionId)]
        : [],
    [uid, connectionId],
  );

  const { data, loading } = useFirestoreCollection<Contact>(
    'contacts',
    constraints,
    !!uid && !!connectionId,
  );

  return { contacts: data, loading };
};
