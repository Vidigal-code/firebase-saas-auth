import type { Message, MessageStatus } from './types';

export const MESSAGE_FILTERS = ['all', 'sent', 'scheduled'] as const;
export type MessageFilter = (typeof MESSAGE_FILTERS)[number];

const matchesFilter = (status: MessageStatus, filter: MessageFilter) => filter === 'all' || status === filter;

export const filterMessages = (messages: readonly Message[], filter: MessageFilter): Message[] =>
  messages.filter((message) => matchesFilter(message.status, filter));

export const countByFilter = (messages: readonly Message[]): Record<MessageFilter, number> =>
  Object.fromEntries(
    MESSAGE_FILTERS.map((filter) => [filter, filterMessages(messages, filter).length]),
  ) as Record<MessageFilter, number>;
