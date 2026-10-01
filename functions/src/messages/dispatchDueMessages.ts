import { FieldValue, type Firestore, type QueryDocumentSnapshot, type Timestamp } from 'firebase-admin/firestore';
import { FIRESTORE_PAGE_SIZE } from '../config/runtime';
import { COLLECTIONS, FIELDS, MESSAGE_STATUS } from '../domain/collections';
import { runBulkWrites } from '../lib/bulkWrite';
import { forEachPage } from '../lib/pagination';

export interface DispatchSummary {
  due: number;
  dispatched: number;
}

const buildDueMessagesQuery = (db: Firestore, now: Timestamp) =>
  db
    .collection(COLLECTIONS.messages)
    .where(FIELDS.status, '==', MESSAGE_STATUS.scheduled)
    .where(FIELDS.scheduledAt, '<=', now)
    .orderBy(FIELDS.scheduledAt);

const buildSentUpdate = () => ({
  status: MESSAGE_STATUS.sent,
  sentAt: FieldValue.serverTimestamp(),
  updatedAt: FieldValue.serverTimestamp(),
});

// The precondition skips messages the client edited after this run read them;
// they are picked up again on the next tick with their latest schedule.
const markAsSent = (db: Firestore, docs: QueryDocumentSnapshot[]) =>
  runBulkWrites(
    db,
    docs.map((doc) => (writer) => writer.update(doc.ref, buildSentUpdate(), { lastUpdateTime: doc.updateTime })),
  );

export const dispatchDueMessages = async (db: Firestore, now: Timestamp): Promise<DispatchSummary> => {
  let due = 0;
  const dispatched = await forEachPage({
    query: buildDueMessagesQuery(db, now),
    pageSize: FIRESTORE_PAGE_SIZE,
    handlePage: (docs) => {
      due += docs.length;
      return markAsSent(db, docs);
    },
  });
  return { due, dispatched };
};
