import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { deleteConnectionData } from '../src/cascade/deleteConnectionData';
import { detachContactFromMessages } from '../src/cascade/detachContactFromMessages';
import { COLLECTIONS, FIELDS } from '../src/domain/collections';
import { clearCollections, startEmulatorContext, stopEmulatorContext, type EmulatorContext } from './helpers/emulator';

const CLIENT_A = 'client-a';
const CLIENT_B = 'client-b';
const CONNECTION_A = 'conn-a';
const CONTACT_1 = 'c1';
const CONTACT_2 = 'c2';
const CONNECTION_SCOPE = { clientId: CLIENT_A, connectionId: CONNECTION_A };
const CONTACT_SCOPE = { clientId: CLIENT_A, contactId: CONTACT_1 };
const TENANT_COLLECTIONS = [COLLECTIONS.connections, COLLECTIONS.contacts, COLLECTIONS.messages] as const;

describe('cascade cleanup', () => {
  let context: EmulatorContext;

  const seed = (collectionName: string, id: string, data: Record<string, unknown>) =>
    context.db.collection(collectionName).doc(id).set(data);

  const exists = async (collectionName: string, id: string) =>
    (await context.db.collection(collectionName).doc(id).get()).exists;

  const readContactIds = async (id: string) =>
    (await context.db.collection(COLLECTIONS.messages).doc(id).get()).get(FIELDS.contactIds);

  beforeAll(() => {
    context = startEmulatorContext();
  });

  afterAll(() => stopEmulatorContext(context));

  beforeEach(() => clearCollections(context.db, TENANT_COLLECTIONS));

  describe('deleteConnectionData', () => {
    beforeEach(async () => {
      await Promise.all([
        seed(COLLECTIONS.contacts, 'contact-a1', { clientId: CLIENT_A, connectionId: CONNECTION_A }),
        seed(COLLECTIONS.messages, 'message-a1', { clientId: CLIENT_A, connectionId: CONNECTION_A }),
        seed(COLLECTIONS.contacts, 'contact-a2', { clientId: CLIENT_A, connectionId: 'conn-other' }),
        seed(COLLECTIONS.contacts, 'contact-b1', { clientId: CLIENT_B, connectionId: CONNECTION_A }),
      ]);
    });

    it('removes contacts and messages of the deleted connection', async () => {
      const deleted = await deleteConnectionData(context.db, CONNECTION_SCOPE);

      expect(deleted).toBe(2);
      expect(await exists(COLLECTIONS.contacts, 'contact-a1')).toBe(false);
      expect(await exists(COLLECTIONS.messages, 'message-a1')).toBe(false);
    });

    it('keeps data from other connections and other clients', async () => {
      await deleteConnectionData(context.db, CONNECTION_SCOPE);

      expect(await exists(COLLECTIONS.contacts, 'contact-a2')).toBe(true);
      expect(await exists(COLLECTIONS.contacts, 'contact-b1')).toBe(true);
    });
  });

  describe('detachContactFromMessages', () => {
    beforeEach(async () => {
      await Promise.all([
        seed(COLLECTIONS.messages, 'message-a1', { clientId: CLIENT_A, contactIds: [CONTACT_1, CONTACT_2] }),
        seed(COLLECTIONS.messages, 'message-a2', { clientId: CLIENT_A, contactIds: [CONTACT_2] }),
        seed(COLLECTIONS.messages, 'message-b1', { clientId: CLIENT_B, contactIds: [CONTACT_1] }),
      ]);
    });

    it('removes the deleted contact from the client messages', async () => {
      const updated = await detachContactFromMessages(context.db, CONTACT_SCOPE);

      expect(updated).toBe(1);
      expect(await readContactIds('message-a1')).toEqual([CONTACT_2]);
      expect(await readContactIds('message-a2')).toEqual([CONTACT_2]);
    });

    it('never touches messages of another client', async () => {
      await detachContactFromMessages(context.db, CONTACT_SCOPE);

      expect(await readContactIds('message-b1')).toEqual([CONTACT_1]);
    });
  });
});
