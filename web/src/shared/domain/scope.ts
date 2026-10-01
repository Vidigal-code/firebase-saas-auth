// Every tenant document is addressed by its owner (the signed-in client) and its connection.
export interface ConnectionScope {
  clientId: string;
  connectionId: string;
}
