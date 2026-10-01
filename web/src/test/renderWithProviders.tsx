import { ThemeProvider } from '@mui/material/styles';
import { render, type RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router';
import { SessionContext, type Session } from '@/entities/session/sessionContext';
import { I18nProvider } from '@/shared/i18n/I18nProvider';
import { appTheme } from '@/shared/theme/theme';
import { NotificationProvider } from '@/shared/ui/notifications/NotificationProvider';

export const TEST_USER = { uid: 'client-a', email: 'ana@example.com' } as const;

export const AUTHENTICATED: Session = { status: 'authenticated', user: TEST_USER };

export interface RenderOptions {
  route?: string;
  session?: Session;
}

export const renderWithProviders = (
  ui: ReactElement,
  { route = '/', session = AUTHENTICATED }: RenderOptions = {},
): RenderResult =>
  render(
    <ThemeProvider theme={appTheme}>
      <I18nProvider>
        <NotificationProvider>
          <SessionContext.Provider value={session}>
            <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
          </SessionContext.Provider>
        </NotificationProvider>
      </I18nProvider>
    </ThemeProvider>,
  );
