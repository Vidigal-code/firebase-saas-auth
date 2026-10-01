import { deleteApp, initializeApp, type App } from 'firebase-admin/app';
import { getFirestore, Timestamp, type Firestore } from 'firebase-admin/firestore';

const TEST_PROJECT_ID = 'demo-broadcast';
const MINUTE_IN_MS = 60_000;

export interface EmulatorContext {
  app: App;
  db: Firestore;
}

export const startEmulatorContext = (): EmulatorContext => {
  const app = initializeApp({ projectId: TEST_PROJECT_ID }, `test-${Date.now()}`);
  return { app, db: getFirestore(app) };
};

export const stopEmulatorContext = (context: EmulatorContext) => deleteApp(context.app);

export const clearCollections = async (db: Firestore, names: readonly string[]) => {
  const snapshots = await Promise.all(names.map((name) => db.collection(name).get()));
  const writer = db.bulkWriter();
  snapshots.flatMap((snapshot) => snapshot.docs).forEach((doc) => writer.delete(doc.ref));
  await writer.close();
};

export const minutesFrom = (base: Timestamp, minutes: number) =>
  Timestamp.fromMillis(base.toMillis() + minutes * MINUTE_IN_MS);
