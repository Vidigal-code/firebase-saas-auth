import { useOutletContext } from 'react-router';
import type { Connection } from '@/entities/connection/model/types';
import type { ConnectionScope } from '@/shared/domain/scope';

export interface ConnectionOutletContext {
  connection: Connection;
  scope: ConnectionScope;
}

export const useConnectionContext = () => useOutletContext<ConnectionOutletContext>();
