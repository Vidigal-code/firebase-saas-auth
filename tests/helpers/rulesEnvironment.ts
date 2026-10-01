import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { initializeTestEnvironment, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, setDoc, Timestamp, type DocumentData } from 'firebase/firestore';

const ROOT_DIR = join(import.meta.dirname, '..', '..');
const FIREBASE_CONFIG = JSON.parse(readFileSync(join(ROOT_DIR, 'firebase.json'), 'utf8'));
const MINUTE_IN_MS = 60_000;

export const CLIENT_A = 'client-a';
export const CLIENT_B = 'client-b';

export const createRulesEnvironment = () =>
  initializeTestEnvironment({
    projectId: 'demo-broadcast',
    firestore: {
      rules: readFileSync(join(ROOT_DIR, 'firestore.rules'), 'utf8'),
      host: '127.0.0.1',
      port: FIREBASE_CONFIG.emulators.firestore.port,
    },
  });

export const dbAs = (env: RulesTestEnvironment, uid: string) => env.authenticatedContext(uid).firestore();

export const seed = (env: RulesTestEnvironment, path: string, data: DocumentData) =>
  env.withSecurityRulesDisabled((context) => setDoc(doc(context.firestore(), path), data));

export const minutesFromNow = (minutes: number) => Timestamp.fromMillis(Date.now() + minutes * MINUTE_IN_MS);
