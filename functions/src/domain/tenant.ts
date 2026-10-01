export interface ConnectionScope {
  clientId: string;
  connectionId: string;
}

export interface ContactScope {
  clientId: string;
  contactId: string;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0;

export const readClientId = (data: Record<string, unknown> | undefined): string | null => {
  const clientId = data?.clientId;
  return isNonEmptyString(clientId) ? clientId : null;
};
