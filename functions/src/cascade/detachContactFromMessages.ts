import { FieldValue, type Firestore, type QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { FIRESTORE_PAGE_SIZE } from '../config/runtime';
import { COLLECTIONS, FIELDS } from '../domain/collections';
import type { ContactScope } from '../domain/tenant';
import { runBulkWrites } from '../lib/bulkWrite';
import { forEachPage } from '../lib/pagination';

const removeContact = (db: Firestore, docs: QueryDocumentSnapshot[], contactId: string) =>
  runBulkWrites(
    db,
    docs.map((doc) => (writer) => writer.update(doc.ref, { [FIELDS.contactIds]: FieldValue.arrayRemove(contactId) })),
  );

export const detachContactFromMessages = (db: Firestore, scope: ContactScope): Promise<number> =>
  forEachPage({
    query: db
      .collection(COLLECTIONS.messages)
      .where(FIELDS.clientId, '==', scope.clientId)
      .where(FIELDS.contactIds, 'array-contains', scope.contactId),
    pageSize: FIRESTORE_PAGE_SIZE,
    handlePage: (docs) => removeContact(db, docs, scope.contactId),
  });
