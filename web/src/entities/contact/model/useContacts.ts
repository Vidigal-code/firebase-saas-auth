import { useMemo } from 'react';
import type { ConnectionScope } from '@/shared/domain/scope';
import { useRealtimeQuery } from '@/shared/firebase/useRealtimeQuery';
import { contactsQuery } from '../api/contactsRepository';

export const useContacts = (scope: ConnectionScope) => {
  const source = useMemo(() => contactsQuery(scope), [scope]);
  return useRealtimeQuery(source);
};
