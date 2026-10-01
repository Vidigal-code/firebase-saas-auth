export const COLLECTIONS = {
  connections: 'connections',
  contacts: 'contacts',
  messages: 'messages',
} as const;

export const FIELDS = {
  clientId: 'clientId',
  connectionId: 'connectionId',
  contactIds: 'contactIds',
  status: 'status',
  scheduledAt: 'scheduledAt',
} as const;

export const MESSAGE_STATUS = {
  scheduled: 'scheduled',
  sent: 'sent',
} as const;

export type MessageStatus = (typeof MESSAGE_STATUS)[keyof typeof MESSAGE_STATUS];
