import { addDocument, deleteDocument } from '@/shared/lib/firestore';

const COLLECTION = 'messages';

const resolveStatus = (scheduledFor: string | null): 'sent' | 'scheduled' =>
  scheduledFor ? 'scheduled' : 'sent';

export const createMessage = (
  clientId: string,
  connectionId: string,
  contactIds: string[],
  content: string,
  scheduledFor: string | null,
) =>
  addDocument(COLLECTION, {
    clientId,
    connectionId,
    contactIds,
    content,
    status: resolveStatus(scheduledFor),
    scheduledFor,
    createdAt: new Date().toISOString(),
  });

export const deleteMessage = (id: string) =>
  deleteDocument(COLLECTION, id);
