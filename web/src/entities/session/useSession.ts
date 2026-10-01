import { useContext } from 'react';
import { SessionContext, type Session, type SessionUser } from './sessionContext';

export const useSession = (): Session => useContext(SessionContext);

// For screens behind <RequireAuth>, where a signed-in user is guaranteed.
export const useCurrentUser = (): SessionUser => {
  const session = useSession();
  if (session.status !== 'authenticated') throw new Error('useCurrentUser requires an authenticated session.');
  return session.user;
};
