import { addDoc, collection, deleteDoc, doc, orderBy, query, updateDoc, where } from 'firebase/firestore';
import type { ConnectionScope } from '@/shared/domain/scope';
import { db } from '@/shared/firebase/client';
import { COLLECTIONS, FIELDS } from '@/shared/firebase/collections';
import { createReadConverter, toDate, toRequiredDate } from '@/shared/firebase/converters';
import { readOneOf, readString, readStringList } from '@/shared/firebase/fields';
import { creationStamps, updateStamp } from '@/shared/firebase/stamps';
import { buildDeliveryFields, canChangeDelivery } from '../model/delivery';
import type { MessageFormValues } from '../model/messageForm';
import { MESSAGE_STATUSES, type Message } from '../model/types';

const messageConverter = createReadConverter<Message>((id, data) => ({
  id,
  connectionId: readString(data, 'connectionId'),
  contactIds: readStringList(data, 'contactIds'),
  content: readString(data, 'content'),
  status: readOneOf(data, 'status', MESSAGE_STATUSES),
  scheduledAt: toDate(data.scheduledAt),
  sentAt: toDate(data.sentAt),
  createdAt: toRequiredDate(data.createdAt),
}));

const messagesCollection = collection(db, COLLECTIONS.messages);

export const messagesQuery = ({ clientId, connectionId }: ConnectionScope) =>
  query(
    messagesCollection,
    where(FIELDS.clientId, '==', clientId),
    where(FIELDS.connectionId, '==', connectionId),
    orderBy(FIELDS.createdAt, 'desc'),
  ).withConverter(messageConverter);

const contentFields = (values: MessageFormValues) => ({ contactIds: values.contactIds, content: values.content });

export const createMessage = (scope: ConnectionScope, values: MessageFormValues) =>
  addDoc(messagesCollection, {
    ...scope,
    ...contentFields(values),
    ...buildDeliveryFields(values),
    ...creationStamps(),
  });

// Sent messages keep their delivery data; only scheduled ones can be rescheduled or sent now.
export const updateMessage = (message: Message, values: MessageFormValues) =>
  updateDoc(doc(messagesCollection, message.id), {
    ...contentFields(values),
    ...(canChangeDelivery(message.status) ? buildDeliveryFields(values) : {}),
    ...updateStamp(),
  });

export const deleteMessage = (messageId: string) => deleteDoc(doc(messagesCollection, messageId));
