import { getDoc, getDocs, type Query } from 'firebase/firestore';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  connectionDocument,
  connectionsQuery,
  createConnection,
  deleteConnection,
  updateConnection,
} from '@/entities/connection/api/connectionsRepository';
import { contactsQuery, createContact, deleteContact, updateContact } from '@/entities/contact/api/contactsRepository';
import { createMessage, deleteMessage, messagesQuery, updateMessage } from '@/entities/message/api/messagesRepository';
import { changePassword, register, signIn, signOut } from '@/features/auth/model/authService';
import { auth } from '@/shared/firebase/client';

const RUN_ID = Date.now();
const PASSWORD = 'Str0ng!Pass';
const NEW_PASSWORD = 'N3w!Password';
const CLIENT_A = { email: `a.${RUN_ID}@example.com`, password: PASSWORD };
const CLIENT_B = { email: `b.${RUN_ID}@example.com`, password: PASSWORD };
const HOUR_IN_MS = 3_600_000;
const PERMISSION_DENIED = { code: 'permission-denied' };
const PHONE = '+5511988887777';

const readAll = async <T>(query: Query<T>) => (await getDocs(query)).docs.map((snapshot) => snapshot.data());

describe('tenant flow against the emulators', () => {
  let clientA = '';
  let connectionId = '';
  let contactId = '';

  beforeAll(async () => {
    clientA = (await register(CLIENT_A)).uid;
    connectionId = (await createConnection(clientA, { name: 'Vendas' })).id;
    contactId = (await createContact({ clientId: clientA, connectionId }, { name: 'Ana', phone: PHONE })).id;
  });

  afterAll(() => signOut());

  it('stores connections and contacts that the owner reads back in real time queries', async () => {
    await updateConnection(connectionId, { name: 'Vendas SP' });
    await updateContact(contactId, { name: 'Ana Souza', phone: PHONE });

    const [connection] = await readAll(connectionsQuery(clientA));
    const [contact] = await readAll(contactsQuery({ clientId: clientA, connectionId }));

    expect(connection).toMatchObject({ id: connectionId, name: 'Vendas SP' });
    expect(connection.createdAt).toBeInstanceOf(Date);
    expect(contact).toMatchObject({ id: contactId, name: 'Ana Souza', phone: PHONE });
  });

  it('sends, schedules, edits and deletes messages within the rules', async () => {
    const scope = { clientId: clientA, connectionId };
    const scheduledAt = new Date(Date.now() + HOUR_IN_MS);
    const sendNow = (content: string) => ({
      contactIds: [contactId],
      content,
      delivery: 'now' as const,
      scheduledAt: null,
    });
    const sentRef = await createMessage(scope, sendNow('Agora'));
    const scheduledRef = await createMessage(scope, { ...sendNow('Depois'), delivery: 'schedule', scheduledAt });

    const byId = async () => new Map((await readAll(messagesQuery(scope))).map((message) => [message.id, message]));
    const created = await byId();
    expect(created.get(sentRef.id)).toMatchObject({ status: 'sent', scheduledAt: null });
    expect(created.get(scheduledRef.id)).toMatchObject({ status: 'scheduled', scheduledAt, sentAt: null });

    const sent = created.get(sentRef.id);
    const scheduled = created.get(scheduledRef.id);
    if (!sent || !scheduled) throw new Error('Messages were not created.');
    await updateMessage(sent, sendNow('Agora (editada)'));
    await updateMessage(scheduled, sendNow('Depois'));

    const updated = await byId();
    expect(updated.get(sentRef.id)?.content).toBe('Agora (editada)');
    expect(updated.get(scheduledRef.id)?.status).toBe('sent');

    await deleteMessage(sentRef.id);
    expect((await byId()).has(sentRef.id)).toBe(false);
  });

  it("hides one client's data from another client", async () => {
    await signOut();
    await register(CLIENT_B);

    await expect(getDoc(connectionDocument(connectionId))).rejects.toMatchObject(PERMISSION_DENIED);
    const intruderScope = { clientId: auth.currentUser?.uid ?? '', connectionId };
    await expect(createContact(intruderScope, { name: 'Intruso', phone: '1133334444' })).rejects.toMatchObject(
      PERMISSION_DENIED,
    );
    await expect(readAll(connectionsQuery(clientA))).rejects.toMatchObject(PERMISSION_DENIED);
    await expect(deleteConnection(connectionId)).rejects.toMatchObject(PERMISSION_DENIED);

    await signOut();
    await signIn(CLIENT_A);
  });

  it('changes the password of the signed-in client', async () => {
    await changePassword({ currentPassword: PASSWORD, newPassword: NEW_PASSWORD });
    await signOut();

    await expect(signIn(CLIENT_A)).rejects.toThrow();
    await expect(signIn({ ...CLIENT_A, password: NEW_PASSWORD })).resolves.toBeDefined();
  });

  it('lets the owner delete its contact and connection', async () => {
    await deleteContact(contactId);
    await deleteConnection(connectionId);

    expect(await readAll(connectionsQuery(clientA))).toEqual([]);
  });
});
