import Alert, { type AlertColor } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { NotificationContext, type Notifier } from './notificationContext';

const AUTO_HIDE_MS = 4000;

interface Notification {
  id: number;
  message: string;
  severity: AlertColor;
}

export const NotificationProvider = ({ children }: Readonly<{ children: ReactNode }>) => {
  const [current, setCurrent] = useState<Notification | null>(null);

  const show = useCallback(
    (severity: AlertColor) => (message: string) => setCurrent({ id: Date.now(), message, severity }),
    [],
  );

  const notifier = useMemo<Notifier>(() => ({ success: show('success'), error: show('error') }), [show]);

  const close = () => setCurrent(null);

  return (
    <NotificationContext.Provider value={notifier}>
      {children}
      <Snackbar
        key={current?.id}
        open={current !== null}
        autoHideDuration={AUTO_HIDE_MS}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={close} severity={current?.severity ?? 'success'} variant="filled" className="w-full">
          {current?.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};
