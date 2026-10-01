import { useMemo } from 'react';
import type { ConnectionScope } from '@/shared/domain/scope';
import { useRealtimeQuery } from '@/shared/firebase/useRealtimeQuery';
import { messagesQuery } from '../api/messagesRepository';

export const useMessages = (scope: ConnectionScope) => {
  const source = useMemo(() => messagesQuery(scope), [scope]);
  return useRealtimeQuery(source);
};
