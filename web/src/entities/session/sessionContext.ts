import { createContext } from 'react';

export interface SessionUser {
  uid: string;
  email: string | null;
}

export type Session =
  | { status: 'loading' }
  | { status: 'anonymous' }
  | { status: 'authenticated'; user: SessionUser };

export const LOADING_SESSION: Session = { status: 'loading' };

export const SessionContext = createContext<Session>(LOADING_SESSION);
