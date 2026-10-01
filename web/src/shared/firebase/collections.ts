// Mirrors functions/src/domain/collections.ts and firestore.rules: the three
// deployables share this contract but are built and shipped independently.
export const COLLECTIONS = {
  users: 'users',
  connections: 'connections',
  contacts: 'contacts',
  messages: 'messages',
} as const;

export const FIELDS = {
  clientId: 'clientId',
  connectionId: 'connectionId',
  createdAt: 'createdAt',
  name: 'name',
} as const;
