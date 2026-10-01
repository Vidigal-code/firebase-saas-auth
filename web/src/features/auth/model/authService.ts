import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updatePassword,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '@/shared/firebase/client';
import { COLLECTIONS } from '@/shared/firebase/collections';
import type { Credentials, PasswordChange } from './credentials';

export const signIn = ({ email, password }: Credentials) => signInWithEmailAndPassword(auth, email, password);

// Each registered user is a client (tenant); its uid is the clientId of all its data.
export const register = async ({ email, password }: Credentials) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, COLLECTIONS.users, user.uid), { email, createdAt: serverTimestamp() });
  return user;
};

export const signOut = () => firebaseSignOut(auth);

export const changePassword = async ({ currentPassword, newPassword }: PasswordChange) => {
  const user = auth.currentUser;
  if (!user?.email) throw new Error('No signed-in user with email credentials.');

  await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, currentPassword));
  await updatePassword(user, newPassword);
};
