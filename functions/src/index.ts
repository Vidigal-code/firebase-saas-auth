import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { onDocumentDeleted } from 'firebase-functions/v2/firestore';
import { setGlobalOptions } from 'firebase-functions/v2/options';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { deleteConnectionData } from './cascade/deleteConnectionData';
import { detachContactFromMessages } from './cascade/detachContactFromMessages';
import { DISPATCH_SCHEDULE, MAX_INSTANCES, REGION } from './config/runtime';
import { COLLECTIONS } from './domain/collections';
import { readClientId } from './domain/tenant';
import { dispatchDueMessages } from './messages/dispatchDueMessages';

initializeApp();
setGlobalOptions({ region: REGION, maxInstances: MAX_INSTANCES });

const db = getFirestore();

export const dispatchScheduledMessages = onSchedule({ schedule: DISPATCH_SCHEDULE, retryCount: 0 }, async () => {
  const summary = await dispatchDueMessages(db, Timestamp.now());
  logger.info('Scheduled messages dispatched', summary);
});

export const cleanupDeletedConnection = onDocumentDeleted(`${COLLECTIONS.connections}/{connectionId}`, async (event) => {
  const clientId = readClientId(event.data?.data());
  if (!clientId) return;

  const { connectionId } = event.params;
  const deleted = await deleteConnectionData(db, { clientId, connectionId });
  logger.info('Connection data removed', { connectionId, deleted });
});

export const detachDeletedContact = onDocumentDeleted(`${COLLECTIONS.contacts}/{contactId}`, async (event) => {
  const clientId = readClientId(event.data?.data());
  if (!clientId) return;

  const { contactId } = event.params;
  const updated = await detachContactFromMessages(db, { clientId, contactId });
  logger.info('Deleted contact detached from messages', { contactId, updated });
});
