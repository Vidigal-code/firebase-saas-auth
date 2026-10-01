const CONNECTION_PARAM = ':connectionId';
const CONNECTIONS_PATH = '/connections';

export const CONNECTION_SEGMENTS = {
  contacts: 'contacts',
  broadcast: 'broadcast',
} as const;

const CONNECTION_PATH = `${CONNECTIONS_PATH}/${CONNECTION_PARAM}`;

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  connections: CONNECTIONS_PATH,
  connection: CONNECTION_PATH,
  contacts: `${CONNECTION_PATH}/${CONNECTION_SEGMENTS.contacts}`,
  broadcast: `${CONNECTION_PATH}/${CONNECTION_SEGMENTS.broadcast}`,
} as const;

const withConnection = (pattern: string, connectionId: string): string =>
  pattern.replace(CONNECTION_PARAM, encodeURIComponent(connectionId));

export const buildContactsPath = (connectionId: string): string => withConnection(ROUTES.contacts, connectionId);
export const buildBroadcastPath = (connectionId: string): string => withConnection(ROUTES.broadcast, connectionId);
