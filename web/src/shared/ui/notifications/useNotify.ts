import { useContext } from 'react';
import { NotificationContext, type Notifier } from './notificationContext';

export const useNotify = (): Notifier => {
  const notifier = useContext(NotificationContext);
  if (!notifier) throw new Error('useNotify must be used inside <NotificationProvider>.');
  return notifier;
};
