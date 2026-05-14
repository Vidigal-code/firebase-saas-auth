import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/shared/config/firebase';

export const addDocument = (col: string, data: DocumentData) =>
  addDoc(collection(db, col), data);

export const updateDocument = (col: string, id: string, data: DocumentData) =>
  updateDoc(doc(db, col, id), data);

export const deleteDocument = (col: string, id: string) =>
  deleteDoc(doc(db, col, id));

export const buildQuery = (col: string, ...constraints: QueryConstraint[]) =>
  query(collection(db, col), ...constraints);

export const subscribeToQuery = <T>(
  col: string,
  constraints: QueryConstraint[],
  onData: (data: T[]) => void,
  onError: (error: Error) => void,
) => {
  const q = buildQuery(col, ...constraints);
  return onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as T[];
      onData(data);
    },
    onError,
  );
};

export { where };
