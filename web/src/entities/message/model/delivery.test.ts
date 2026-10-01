import { serverTimestamp, Timestamp } from 'firebase/firestore';
import { describe, expect, it } from 'vitest';
import { buildDeliveryFields, canChangeDelivery } from './delivery';

describe('buildDeliveryFields', () => {
  it('marks an immediate message as sent by the server clock', () => {
    expect(buildDeliveryFields({ delivery: 'now', scheduledAt: null })).toEqual({
      status: 'sent',
      scheduledAt: null,
      sentAt: serverTimestamp(),
    });
  });

  it('keeps a scheduled message pending until the Cloud Function sends it', () => {
    const scheduledAt = new Date(2026, 9, 1, 18, 30);

    expect(buildDeliveryFields({ delivery: 'schedule', scheduledAt })).toEqual({
      status: 'scheduled',
      scheduledAt: Timestamp.fromDate(scheduledAt),
      sentAt: null,
    });
  });

  it('refuses to schedule without a date', () => {
    expect(() => buildDeliveryFields({ delivery: 'schedule', scheduledAt: null })).toThrow();
  });
});

describe('canChangeDelivery', () => {
  it('allows rescheduling only while the message is still scheduled', () => {
    expect(canChangeDelivery('scheduled')).toBe(true);
    expect(canChangeDelivery('sent')).toBe(false);
  });
});
