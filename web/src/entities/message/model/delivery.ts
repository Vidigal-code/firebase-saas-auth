import { serverTimestamp, Timestamp, type FieldValue } from 'firebase/firestore';
import type { MessageStatus } from './types';

export const DELIVERY_MODES = ['now', 'schedule'] as const;
export type DeliveryMode = (typeof DELIVERY_MODES)[number];

export interface DeliveryChoice {
  delivery: DeliveryMode;
  scheduledAt: Date | null;
}

export interface DeliveryFields {
  status: MessageStatus;
  scheduledAt: Timestamp | null;
  sentAt: FieldValue | null;
}

// Sending "now" is a simulation: the message is stored as sent with the server time.
// Scheduled messages stay pending until the dispatchScheduledMessages Cloud Function runs.
export const buildDeliveryFields = ({ delivery, scheduledAt }: DeliveryChoice): DeliveryFields => {
  if (delivery === 'now') return { status: 'sent', scheduledAt: null, sentAt: serverTimestamp() };
  if (!scheduledAt) throw new Error('A scheduled message needs a delivery date.');
  return { status: 'scheduled', scheduledAt: Timestamp.fromDate(scheduledAt), sentAt: null };
};

export const canChangeDelivery = (status: MessageStatus): boolean => status === 'scheduled';
