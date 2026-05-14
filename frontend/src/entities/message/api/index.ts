import { collection, doc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/shared/config/firebase';

export const createMessage = async (
  clientId: string, 
  connectionId: string, 
  contactIds: string[], 
  content: string, 
  scheduledFor: string | null
) => {
  const status = scheduledFor ? 'scheduled' : 'sent';
  
  return addDoc(collection(db, 'messages'), {
    clientId,
    connectionId,
    contactIds,
    content,
    status,
    scheduledFor,
    createdAt: new Date().toISOString()
  });
};

export const deleteMessage = async (id: string) => {
  const docRef = doc(db, 'messages', id);
  return deleteDoc(docRef);
};
