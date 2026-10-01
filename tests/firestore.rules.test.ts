import { assertFails, assertSucceeds, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
} from 'firebase/firestore';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { CLIENT_A, CLIENT_B, createRulesEnvironment, dbAs, minutesFromNow, seed } from './helpers/rulesEnvironment';

const CONNECTIONS = 'connections';
const CONTACTS = 'contacts';
const MESSAGES = 'messages';
const CONN_A_ID = 'conn-a';
const CONN_B_ID = 'conn-b';
const CONTACT_A_ID = 'contact-a';
const CONNECTION_A = `${CONNECTIONS}/${CONN_A_ID}`;
const CONNECTION_B = `${CONNECTIONS}/${CONN_B_ID}`;
const CONTACT_A = `${CONTACTS}/${CONTACT_A_ID}`;
const SCHEDULED_A = `${MESSAGES}/scheduled-a`;
const SENT_A = `${MESSAGES}/sent-a`;
const STATUS_SENT = 'sent';
const STATUS_SCHEDULED = 'scheduled';
const SALES = 'Sales';
const HACKED = 'Hacked';
const PROFILE_EMAIL = 'a@example.com';
const BLANK = '   ';
const PAST_SEED_MINUTES = -60;
const FUTURE_SCHEDULE_MINUTES = 30;

const touched = (fields: DocumentData): DocumentData => ({ ...fields, updatedAt: serverTimestamp() });

const newConnection = (clientId: string): DocumentData => ({
  clientId,
  name: SALES,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

const newContact = (clientId: string, connectionId: string): DocumentData => ({
  clientId,
  connectionId,
  name: 'Maria',
  phone: '+5511999998888',
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

const newMessage = (overrides: DocumentData = {}): DocumentData => ({
  clientId: CLIENT_A,
  connectionId: CONN_A_ID,
  contactIds: [CONTACT_A_ID],
  content: 'Promo today',
  status: STATUS_SENT,
  scheduledAt: null,
  sentAt: serverTimestamp(),
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  ...overrides,
});

const newScheduledMessage = (overrides: DocumentData = {}) =>
  newMessage({
    status: STATUS_SCHEDULED,
    scheduledAt: minutesFromNow(FUTURE_SCHEDULE_MINUTES),
    sentAt: null,
    ...overrides,
  });

const expectAllowed = (operation: Promise<unknown>) => expect(assertSucceeds(operation)).resolves.not.toThrow();
const expectDenied = (operation: Promise<unknown>) => expect(assertFails(operation)).resolves.not.toThrow();

const newProfile = (): DocumentData => ({ email: PROFILE_EMAIL, createdAt: serverTimestamp() });

describe('firestore.rules', () => {
  let env: RulesTestEnvironment;

  const asA = () => dbAs(env, CLIENT_A);
  const asB = () => dbAs(env, CLIENT_B);
  const addAsA = (collectionName: string, data: DocumentData) => addDoc(collection(asA(), collectionName), data);
  const listConnectionsOf = (clientId: string) =>
    getDocs(query(collection(asA(), CONNECTIONS), where('clientId', '==', clientId)));

  beforeAll(async () => {
    env = await createRulesEnvironment();
  });

  afterAll(() => env.cleanup());

  beforeEach(async () => {
    await env.clearFirestore();
    const past = minutesFromNow(PAST_SEED_MINUTES);
    const existing = { createdAt: past, updatedAt: past };
    await Promise.all([
      seed(env, CONNECTION_A, { clientId: CLIENT_A, name: SALES, ...existing }),
      seed(env, CONNECTION_B, { clientId: CLIENT_B, name: 'Support', ...existing }),
      seed(env, CONTACT_A, { ...newContact(CLIENT_A, CONN_A_ID), name: 'Ana', phone: '+5511988887777', ...existing }),
      seed(env, SCHEDULED_A, newScheduledMessage(existing)),
      seed(env, SENT_A, newMessage({ ...existing, sentAt: past })),
    ]);
  });

  describe('anonymous visitors', () => {
    it('cannot read any tenant data', async () => {
      const anonymous = env.unauthenticatedContext().firestore();
      await expectDenied(getDoc(doc(anonymous, CONNECTION_A)));
    });
  });

  describe('users', () => {
    it('lets a client create its own profile', async () => {
      await expectAllowed(setDoc(doc(asA(), `users/${CLIENT_A}`), newProfile()));
    });

    it("blocks writing another client's profile", async () => {
      await expectDenied(setDoc(doc(asA(), `users/${CLIENT_B}`), newProfile()));
    });
  });

  describe('connections', () => {
    it('lets a client create a connection it owns', async () => {
      await expectAllowed(addAsA(CONNECTIONS, newConnection(CLIENT_A)));
    });

    it('blocks creating a connection on behalf of another client', async () => {
      await expectDenied(addAsA(CONNECTIONS, newConnection(CLIENT_B)));
    });

    it('rejects unexpected fields and blank names', async () => {
      await expectDenied(addAsA(CONNECTIONS, { ...newConnection(CLIENT_A), role: 'admin' }));
      await expectDenied(addAsA(CONNECTIONS, { ...newConnection(CLIENT_A), name: BLANK }));
    });

    it('lists only connections filtered by the signed-in client', async () => {
      await expectAllowed(listConnectionsOf(CLIENT_A));
      await expectDenied(getDocs(collection(asA(), CONNECTIONS)));
      await expectDenied(listConnectionsOf(CLIENT_B));
    });

    it("blocks reading, editing and deleting another client's connection", async () => {
      await expectDenied(getDoc(doc(asB(), CONNECTION_A)));
      await expectDenied(updateDoc(doc(asB(), CONNECTION_A), touched({ name: HACKED })));
      await expectDenied(deleteDoc(doc(asB(), CONNECTION_A)));
    });

    it('lets the owner rename and delete its connection', async () => {
      await expectAllowed(updateDoc(doc(asA(), CONNECTION_A), touched({ name: 'Marketing' })));
      await expectAllowed(deleteDoc(doc(asA(), CONNECTION_A)));
    });

    it('prevents transferring a connection to another client', async () => {
      await expectDenied(updateDoc(doc(asA(), CONNECTION_A), touched({ clientId: CLIENT_B })));
    });
  });

  describe('contacts', () => {
    it('lets a client add contacts to its own connection', async () => {
      await expectAllowed(addAsA(CONTACTS, newContact(CLIENT_A, CONN_A_ID)));
    });

    it("blocks attaching contacts to another client's connection", async () => {
      await expectDenied(addAsA(CONTACTS, newContact(CLIENT_A, CONN_B_ID)));
      await expectDenied(addAsA(CONTACTS, newContact(CLIENT_A, 'missing')));
    });

    it('rejects invalid phone numbers', async () => {
      await expectDenied(addAsA(CONTACTS, { ...newContact(CLIENT_A, CONN_A_ID), phone: '12ab' }));
    });

    it('lets the owner edit name and phone but not move the contact', async () => {
      await expectAllowed(updateDoc(doc(asA(), CONTACT_A), touched({ name: 'Ana Paula', phone: '+5511900001111' })));
      await expectDenied(updateDoc(doc(asA(), CONTACT_A), touched({ connectionId: CONN_B_ID })));
    });

    it('blocks another client from reading or deleting the contact', async () => {
      await expectDenied(getDoc(doc(asB(), CONTACT_A)));
      await expectDenied(deleteDoc(doc(asB(), CONTACT_A)));
    });
  });

  describe('messages', () => {
    it('lets a client send a message immediately', async () => {
      await expectAllowed(addAsA(MESSAGES, newMessage()));
    });

    it('lets a client schedule a message for the future', async () => {
      await expectAllowed(addAsA(MESSAGES, newScheduledMessage()));
    });

    it('rejects schedules in the past and inconsistent delivery data', async () => {
      await expectDenied(addAsA(MESSAGES, newScheduledMessage({ scheduledAt: minutesFromNow(-5) })));
      await expectDenied(addAsA(MESSAGES, newMessage({ sentAt: minutesFromNow(10) })));
      await expectDenied(addAsA(MESSAGES, newScheduledMessage({ sentAt: serverTimestamp() })));
    });

    it('requires at least one recipient and a non-empty text', async () => {
      await expectDenied(addAsA(MESSAGES, newMessage({ contactIds: [] })));
      await expectDenied(addAsA(MESSAGES, newMessage({ content: BLANK })));
    });

    it("blocks messages targeting another client's connection", async () => {
      await expectDenied(addAsA(MESSAGES, newMessage({ connectionId: CONN_B_ID })));
    });

    it('lets the owner reschedule or send a scheduled message now', async () => {
      await expectAllowed(updateDoc(doc(asA(), SCHEDULED_A), touched({ scheduledAt: minutesFromNow(90) })));
      const sendNow = touched({ status: STATUS_SENT, scheduledAt: null, sentAt: serverTimestamp() });
      await expectAllowed(updateDoc(doc(asA(), SCHEDULED_A), sendNow));
    });

    it('lets the owner edit the text of a sent message without changing its delivery', async () => {
      await expectAllowed(updateDoc(doc(asA(), SENT_A), touched({ content: 'Fixed typo' })));
      const reschedule = touched({
        status: STATUS_SCHEDULED,
        scheduledAt: minutesFromNow(FUTURE_SCHEDULE_MINUTES),
        sentAt: null,
      });
      await expectDenied(updateDoc(doc(asA(), SENT_A), reschedule));
    });

    it('blocks clients from forging the scheduler transition', async () => {
      const forgedSend = touched({ status: STATUS_SENT, sentAt: minutesFromNow(-10) });
      await expectDenied(updateDoc(doc(asA(), SCHEDULED_A), forgedSend));
    });

    it('blocks another client from reading, editing or deleting messages', async () => {
      await expectDenied(getDoc(doc(asB(), SCHEDULED_A)));
      await expectDenied(updateDoc(doc(asB(), SCHEDULED_A), touched({ content: HACKED })));
      await expectDenied(deleteDoc(doc(asB(), SENT_A)));
    });

    it('lets the owner delete its messages', async () => {
      await expectAllowed(deleteDoc(doc(asA(), SENT_A)));
    });
  });
});
