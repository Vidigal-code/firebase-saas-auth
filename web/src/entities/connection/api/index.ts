import { addDocument, updateDocument, deleteDocument } from '@/shared/lib/firestore';

const COLLECTION = 'connections';

export const createConnection = (clientId: string, name: string) =>
  addDocument(COLLECTION, {
    clientId,
    name,
    createdAt: new Date().toISOString(),
  });

export const updateConnection = (id: string, name: string) =>
  updateDocument(COLLECTION, id, { name });

export const deleteConnection = (id: string) =>
  deleteDocument(COLLECTION, id);
