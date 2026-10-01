import { describe, expect, it } from 'vitest';
import { countByFilter, filterMessages } from './filters';
import type { Message } from './types';

const buildMessage = (id: string, status: Message['status']): Message => ({
  id,
  connectionId: 'conn-a',
  contactIds: ['c1'],
  content: `Message ${id}`,
  status,
  scheduledAt: null,
  sentAt: null,
  createdAt: new Date(2026, 9, 1),
});

const MESSAGES = [buildMessage('1', 'sent'), buildMessage('2', 'scheduled'), buildMessage('3', 'sent')];

describe('filterMessages', () => {
  it('returns every message for the "all" filter', () => {
    expect(filterMessages(MESSAGES, 'all')).toHaveLength(3);
  });

  it('keeps only sent messages', () => {
    expect(filterMessages(MESSAGES, 'sent').map((message) => message.id)).toEqual(['1', '3']);
  });

  it('keeps only scheduled messages', () => {
    expect(filterMessages(MESSAGES, 'scheduled').map((message) => message.id)).toEqual(['2']);
  });
});

describe('countByFilter', () => {
  it('counts messages per filter', () => {
    expect(countByFilter(MESSAGES)).toEqual({ all: 3, sent: 2, scheduled: 1 });
  });

  it('counts zero for an empty list', () => {
    expect(countByFilter([])).toEqual({ all: 0, sent: 0, scheduled: 0 });
  });
});
