import { addDoc, collection, deleteDoc, doc, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { db } from '@/shared/firebase/client';
import { COLLECTIONS, FIELDS } from '@/shared/firebase/collections';
import { createReadConverter, toRequiredDate } from '@/shared/firebase/converters';
import { readString } from '@/shared/firebase/fields';
import { creationStamps, updateStamp } from '@/shared/firebase/stamps';
import type { Connection, ConnectionFormValues } from '../model/types';

const connectionConverter = createReadConverter<Connection>((id, data) => ({
  id,
  name: readString(data, 'name'),
  createdAt: toRequiredDate(data.createdAt),
}));

const connectionsCollection = collection(db, COLLECTIONS.connections);

export const connectionsQuery = (clientId: string) =>
  query(
    connectionsCollection,
    where(FIELDS.clientId, '==', clientId),
    orderBy(FIELDS.createdAt, 'desc'),
  ).withConverter(connectionConverter);

export const connectionDocument = (connectionId: string) =>
  doc(connectionsCollection, connectionId).withConverter(connectionConverter);

export const createConnection = (clientId: string, values: ConnectionFormValues) =>
  addDoc(connectionsCollection, { clientId, name: values.name, ...creationStamps() });

export const updateConnection = (connectionId: string, values: ConnectionFormValues) =>
  updateDoc(doc(connectionsCollection, connectionId), { name: values.name, ...updateStamp() });

// Contacts and messages of the connection are removed by the cleanupDeletedConnection Cloud Function.
export const deleteConnection = (connectionId: string) => deleteDoc(doc(connectionsCollection, connectionId));
