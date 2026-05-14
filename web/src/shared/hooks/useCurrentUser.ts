import { useAppSelector } from './redux';

export const useCurrentUser = () => {
  const { user, isAuthenticated, isInitialized } = useAppSelector((s) => s.user);
  return { user, isAuthenticated, isInitialized, uid: user?.uid ?? null };
};
