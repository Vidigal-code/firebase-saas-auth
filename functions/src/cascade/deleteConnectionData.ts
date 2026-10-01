import type { Firestore, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { FIRESTORE_PAGE_SIZE } from '../config/runtime';
import { COLLECTIONS, FIELDS } from '../domain/collections';
import type { ConnectionScope } from '../domain/tenant';
import { runBulkWrites } from '../lib/bulkWrite';
import { forEachPage } from '../lib/pagination';

const CHILD_COLLECTIONS = [COLLECTIONS.contacts, COLLECTIONS.messages] as const;

const deleteDocs = (db: Firestore, docs: QueryDocumentSnapshot[]) =>
  runBulkWrites(
    db,
    docs.map((doc) => (writer) => writer.delete(doc.ref)),
  );

const deleteChildren = (db: Firestore, scope: ConnectionScope, collectionName: string) =>
  forEachPage({
    query: db
      .collection(collectionName)
      .where(FIELDS.clientId, '==', scope.clientId)
      .where(FIELDS.connectionId, '==', scope.connectionId),
    pageSize: FIRESTORE_PAGE_SIZE,
    handlePage: (docs) => deleteDocs(db, docs),
  });

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

export const deleteConnectionData = async (db: Firestore, scope: ConnectionScope): Promise<number> => {
  const deletedPerCollection = await Promise.all(
    CHILD_COLLECTIONS.map((collectionName) => deleteChildren(db, scope, collectionName)),
  );
  return sum(deletedPerCollection);
};
