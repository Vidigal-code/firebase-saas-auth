import { collection, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/shared/config/firebase';

export const createConnection = async (clientId: string, name: string) => {
  return addDoc(collection(db, 'connections'), {
    clientId,
    name,
    createdAt: new Date().toISOString()
  });
};

export const updateConnection = async (id: string, name: string) => {
  const docRef = doc(db, 'connections', id);
  return updateDoc(docRef, { name });
};

export const deleteConnection = async (id: string) => {
  const docRef = doc(db, 'connections', id);
  return deleteDoc(docRef);
};
