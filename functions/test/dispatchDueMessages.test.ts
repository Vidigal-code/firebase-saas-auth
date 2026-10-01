import { Timestamp } from 'firebase-admin/firestore';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { FIRESTORE_PAGE_SIZE } from '../src/config/runtime';
import { COLLECTIONS, MESSAGE_STATUS, type MessageStatus } from '../src/domain/collections';
import { dispatchDueMessages } from '../src/messages/dispatchDueMessages';
import {
  clearCollections,
  minutesFrom,
  startEmulatorContext,
  stopEmulatorContext,
  type EmulatorContext,
} from './helpers/emulator';

const CLIENT_ID = 'client-a';
const EXTRA_PAGE_MESSAGES = 50;
const NOW = Timestamp.fromDate(new Date('2026-10-01T12:00:00Z'));

describe('dispatchDueMessages', () => {
  let context: EmulatorContext;

  const seedMessage = (id: string, status: MessageStatus, scheduledAt: Timestamp | null) =>
    context.db.collection(COLLECTIONS.messages).doc(id).set({
      clientId: CLIENT_ID,
      connectionId: 'connection-a',
      contactIds: ['contact-a'],
      content: 'Hello',
      status,
      scheduledAt,
      sentAt: null,
    });

  const readMessage = async (id: string) =>
    (await context.db.collection(COLLECTIONS.messages).doc(id).get()).data();

  beforeAll(() => {
    context = startEmulatorContext();
  });

  afterAll(() => stopEmulatorContext(context));

  beforeEach(() => clearCollections(context.db, [COLLECTIONS.messages]));

  it('marks scheduled messages whose time has arrived as sent', async () => {
    await seedMessage('due', MESSAGE_STATUS.scheduled, minutesFrom(NOW, -1));

    const summary = await dispatchDueMessages(context.db, NOW);

    expect(summary).toEqual({ due: 1, dispatched: 1 });
    const message = await readMessage('due');
    expect(message?.status).toBe(MESSAGE_STATUS.sent);
    expect(message?.sentAt).toBeInstanceOf(Timestamp);
  });

  it('dispatches a message scheduled exactly for now', async () => {
    await seedMessage('boundary', MESSAGE_STATUS.scheduled, NOW);

    const summary = await dispatchDueMessages(context.db, NOW);

    expect(summary.dispatched).toBe(1);
  });

  it('keeps future messages scheduled', async () => {
    await seedMessage('future', MESSAGE_STATUS.scheduled, minutesFrom(NOW, 5));

    const summary = await dispatchDueMessages(context.db, NOW);

    expect(summary).toEqual({ due: 0, dispatched: 0 });
    expect((await readMessage('future'))?.status).toBe(MESSAGE_STATUS.scheduled);
  });

  it('leaves messages that were already sent untouched', async () => {
    await seedMessage('sent', MESSAGE_STATUS.sent, null);

    const summary = await dispatchDueMessages(context.db, NOW);

    expect(summary.due).toBe(0);
    expect((await readMessage('sent'))?.sentAt).toBeNull();
  });

  it('processes every due message across multiple pages', async () => {
    const total = FIRESTORE_PAGE_SIZE + EXTRA_PAGE_MESSAGES;
    const writer = context.db.bulkWriter();
    Array.from({ length: total }, (_, index) =>
      writer.set(context.db.collection(COLLECTIONS.messages).doc(`bulk-${index}`), {
        clientId: CLIENT_ID,
        status: MESSAGE_STATUS.scheduled,
        scheduledAt: minutesFrom(NOW, -10),
      }),
    );
    await writer.close();

    const summary = await dispatchDueMessages(context.db, NOW);

    expect(summary).toEqual({ due: total, dispatched: total });
  });
});
