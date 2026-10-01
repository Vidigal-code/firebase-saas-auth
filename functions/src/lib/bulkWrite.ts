import type { BulkWriter, Firestore } from 'firebase-admin/firestore';

export type WriteOperation = (writer: BulkWriter) => Promise<unknown>;

const isFulfilled = (result: PromiseSettledResult<unknown>) => result.status === 'fulfilled';

export const runBulkWrites = async (db: Firestore, operations: WriteOperation[]): Promise<number> => {
  const writer = db.bulkWriter();
  const pending = operations.map((operation) => operation(writer));
  await writer.close();
  const results = await Promise.allSettled(pending);
  return results.filter(isFulfilled).length;
};
