import { addDocument, updateDocument, deleteDocument } from '@/shared/lib/firestore';

const COLLECTION = 'contacts';

export const createContact = (
  clientId: string,
  connectionId: string,
  name: string,
  phone: string,
) =>
  addDocument(COLLECTION, {
    clientId,
    connectionId,
    name,
    phone,
    createdAt: new Date().toISOString(),
  });

export const updateContact = (id: string, name: string, phone: string) =>
  updateDocument(COLLECTION, id, { name, phone });

export const deleteContact = (id: string) =>
  deleteDocument(COLLECTION, id);
