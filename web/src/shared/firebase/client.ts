import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { FIREBASE_OPTIONS, USE_EMULATORS } from '@/shared/config/env';
import { AUTH_EMULATOR_URL, EMULATOR_HOST, FIRESTORE_EMULATOR_PORT } from '@/shared/config/emulators';

export const firebaseApp = initializeApp(FIREBASE_OPTIONS);

export const auth = getAuth(firebaseApp);

export const db = getFirestore(firebaseApp);

if (USE_EMULATORS) {
  connectAuthEmulator(auth, AUTH_EMULATOR_URL, { disableWarnings: true });
  connectFirestoreEmulator(db, EMULATOR_HOST, FIRESTORE_EMULATOR_PORT);
}
