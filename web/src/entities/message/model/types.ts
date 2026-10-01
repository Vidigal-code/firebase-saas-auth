export const MESSAGE_STATUSES = ['scheduled', 'sent'] as const;
export type MessageStatus = (typeof MESSAGE_STATUSES)[number];

export interface Message {
  id: string;
  connectionId: string;
  contactIds: string[];
  content: string;
  status: MessageStatus;
  scheduledAt: Date | null;
  sentAt: Date | null;
  createdAt: Date;
}
