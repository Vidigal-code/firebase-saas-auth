import { addDoc, collection, deleteDoc, doc, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { db } from '@/shared/firebase/client';
import { COLLECTIONS, FIELDS } from '@/shared/firebase/collections';
import { createReadConverter } from '@/shared/firebase/converters';
import { readString } from '@/shared/firebase/fields';
import { creationStamps, updateStamp } from '@/shared/firebase/stamps';
import type { ConnectionScope } from '@/shared/domain/scope';
import type { Contact, ContactFormValues } from '../model/types';

const contactConverter = createReadConverter<Contact>((id, data) => ({
  id,
  connectionId: readString(data, 'connectionId'),
  name: readString(data, 'name'),
  phone: readString(data, 'phone'),
}));

const contactsCollection = collection(db, COLLECTIONS.contacts);

export const contactsQuery = ({ clientId, connectionId }: ConnectionScope) =>
  query(
    contactsCollection,
    where(FIELDS.clientId, '==', clientId),
    where(FIELDS.connectionId, '==', connectionId),
    orderBy(FIELDS.name),
  ).withConverter(contactConverter);

export const createContact = (scope: ConnectionScope, values: ContactFormValues) =>
  addDoc(contactsCollection, { ...scope, name: values.name, phone: values.phone, ...creationStamps() });

export const updateContact = (contactId: string, values: ContactFormValues) =>
  updateDoc(doc(contactsCollection, contactId), { name: values.name, phone: values.phone, ...updateStamp() });

// The detachDeletedContact Cloud Function removes the contact from message recipients.
export const deleteContact = (contactId: string) => deleteDoc(doc(contactsCollection, contactId));
