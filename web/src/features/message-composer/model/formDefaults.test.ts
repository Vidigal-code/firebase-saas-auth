import { describe, expect, it } from 'vitest';
import type { Message } from '@/entities/message/model/types';
import { buildFormDefaults } from './formDefaults';

const scheduled: Message = {
  id: 'm1',
  connectionId: 'conn-a',
  contactIds: ['c1', 'gone'],
  content: 'Promo',
  status: 'scheduled',
  scheduledAt: new Date(2026, 9, 2, 8, 15),
  sentAt: null,
  createdAt: new Date(2026, 9, 1),
};

describe('buildFormDefaults', () => {
  it('starts a new message as an immediate send without recipients', () => {
    expect(buildFormDefaults(null, ['c1'])).toEqual({ contactIds: [], content: '', delivery: 'now', scheduledAt: '' });
  });

  it('loads a scheduled message keeping only contacts that still exist', () => {
    expect(buildFormDefaults(scheduled, ['c1', 'c2'])).toEqual({
      contactIds: ['c1'],
      content: 'Promo',
      delivery: 'schedule',
      scheduledAt: '2026-10-02T08:15',
    });
  });

  it('loads a sent message without a schedule', () => {
    const sent: Message = { ...scheduled, status: 'sent', scheduledAt: null, sentAt: new Date() };

    expect(buildFormDefaults(sent, ['c1'])).toMatchObject({ delivery: 'now', scheduledAt: '' });
  });
});
