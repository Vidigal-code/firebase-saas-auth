import {
  Timestamp,
  type DocumentData,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
} from 'firebase/firestore';

const ESTIMATE_PENDING_TIMESTAMPS: SnapshotOptions = { serverTimestamps: 'estimate' };

export const toDate = (value: unknown): Date | null => (value instanceof Timestamp ? value.toDate() : null);

export const toRequiredDate = (value: unknown): Date => toDate(value) ?? new Date();

type DocumentMapper<T> = (id: string, data: DocumentData) => T;

// Read-only converter: writes go through explicit payload builders so that
// serverTimestamp() sentinels and partial updates stay typed per operation.
export const createReadConverter = <T>(mapDocument: DocumentMapper<T>): FirestoreDataConverter<T> => ({
  toFirestore: () => {
    throw new Error('Read-only converter: use the repository write functions.');
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options?: SnapshotOptions) =>
    mapDocument(snapshot.id, snapshot.data({ ...options, ...ESTIMATE_PENDING_TIMESTAMPS })),
});
