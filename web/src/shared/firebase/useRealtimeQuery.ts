import { onSnapshot, type FirestoreError, type Query } from 'firebase/firestore';
import { useSubscription, type Subscribe } from './useSubscription';

export type RealtimeStatus = 'loading' | 'ready' | 'error';

const STATUS_PRIORITY: readonly RealtimeStatus[] = ['error', 'loading', 'ready'];

// Combined status of several listeners: any error wins, then any pending load.
export const mergeStatuses = (statuses: readonly RealtimeStatus[]): RealtimeStatus =>
  STATUS_PRIORITY.find((status) => statuses.includes(status)) ?? 'ready';

export interface RealtimeQueryResult<T> {
  status: RealtimeStatus;
  data: T[];
  error: FirestoreError | null;
}

const QUERY_STATES = {
  idle: { status: 'ready', data: [], error: null },
  loading: { status: 'loading', data: [], error: null },
} as const satisfies Record<string, RealtimeQueryResult<never>>;

const subscribeToQuery: Subscribe<Query<unknown>, RealtimeQueryResult<unknown>> = (source, emit) =>
  onSnapshot(
    source,
    (snapshot) => emit({ status: 'ready', data: snapshot.docs.map((doc) => doc.data()), error: null }),
    (error) => emit({ status: 'error', data: [], error }),
  );

export const useRealtimeQuery = <T>(source: Query<T> | null): RealtimeQueryResult<T> =>
  useSubscription(source, subscribeToQuery, QUERY_STATES) as RealtimeQueryResult<T>;
