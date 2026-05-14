import { collection, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/shared/config/firebase';

export const createContact = async (clientId: string, connectionId: string, name: string, phone: string) => {
  return addDoc(collection(db, 'contacts'), {
    clientId,
    connectionId,
    name,
    phone,
    createdAt: new Date().toISOString()
  });
};

export const updateContact = async (id: string, name: string, phone: string) => {
  const docRef = doc(db, 'contacts', id);
  return updateDoc(docRef, { name, phone });
};

export const deleteContact = async (id: string) => {
  const docRef = doc(db, 'contacts', id);
  return deleteDoc(docRef);
};
