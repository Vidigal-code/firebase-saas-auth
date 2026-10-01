import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState, type ReactNode } from 'react';
import { auth } from '@/shared/firebase/client';
import { LOADING_SESSION, SessionContext, type Session } from './sessionContext';

const toSession = (user: User | null): Session =>
  user ? { status: 'authenticated', user: { uid: user.uid, email: user.email } } : { status: 'anonymous' };

export const SessionProvider = ({ children }: Readonly<{ children: ReactNode }>) => {
  const [session, setSession] = useState<Session>(LOADING_SESSION);

  useEffect(() => onAuthStateChanged(auth, (user) => setSession(toSession(user))), []);

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
};
