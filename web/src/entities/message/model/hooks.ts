import { useMemo } from 'react';
import { where } from '@/shared/lib/firestore';
import { useFirestoreCollection } from '@/shared/hooks/useFirestoreCollection';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';

export interface Message {
  id: string;
  clientId: string;
  connectionId: string;
  contactIds: string[];
  content: string;
  status: 'sent' | 'scheduled';
  scheduledFor: string | null;
  createdAt: string;
}

const sortByCreatedAtDesc = (a: Message, b: Message) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

export const useMessages = (connectionId: string) => {
  const { uid } = useCurrentUser();

  const constraints = useMemo(
    () =>
      uid && connectionId
        ? [where('clientId', '==', uid), where('connectionId', '==', connectionId)]
        : [],
    [uid, connectionId],
  );

  const { data, loading } = useFirestoreCollection<Message>(
    'messages',
    constraints,
    !!uid && !!connectionId,
  );

  const messages = useMemo(() => [...data].sort(sortByCreatedAtDesc), [data]);

  return { messages, loading };
};
