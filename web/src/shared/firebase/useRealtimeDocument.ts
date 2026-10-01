import { onSnapshot, type DocumentReference, type FirestoreError } from 'firebase/firestore';
import type { RealtimeStatus } from './useRealtimeQuery';
import { useSubscription, type Subscribe } from './useSubscription';

export interface RealtimeDocumentResult<T> {
  status: RealtimeStatus;
  data: T | null;
  error: FirestoreError | null;
}

const DOCUMENT_STATES = {
  idle: { status: 'ready', data: null, error: null },
  loading: { status: 'loading', data: null, error: null },
} as const satisfies Record<string, RealtimeDocumentResult<never>>;

const subscribeToDocument: Subscribe<DocumentReference<unknown>, RealtimeDocumentResult<unknown>> = (source, emit) =>
  onSnapshot(
    source,
    (snapshot) => emit({ status: 'ready', data: snapshot.data() ?? null, error: null }),
    (error) => emit({ status: 'error', data: null, error }),
  );

export const useRealtimeDocument = <T>(source: DocumentReference<T> | null): RealtimeDocumentResult<T> =>
  useSubscription(source, subscribeToDocument, DOCUMENT_STATES) as RealtimeDocumentResult<T>;
