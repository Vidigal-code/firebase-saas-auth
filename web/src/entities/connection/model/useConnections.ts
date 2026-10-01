import { useMemo } from 'react';
import { useCurrentUser } from '@/entities/session/useSession';
import { useRealtimeDocument } from '@/shared/firebase/useRealtimeDocument';
import { useRealtimeQuery } from '@/shared/firebase/useRealtimeQuery';
import { connectionDocument, connectionsQuery } from '../api/connectionsRepository';

export const useConnections = () => {
  const { uid } = useCurrentUser();
  const source = useMemo(() => connectionsQuery(uid), [uid]);
  return useRealtimeQuery(source);
};

// Reading a connection owned by another client is denied by the rules and surfaces as an error.
export const useConnection = (connectionId: string) => {
  const source = useMemo(() => connectionDocument(connectionId), [connectionId]);
  return useRealtimeDocument(source);
};
