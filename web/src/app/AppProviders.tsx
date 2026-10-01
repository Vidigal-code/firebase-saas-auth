import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { SessionProvider } from '@/entities/session/SessionProvider';
import { I18nProvider } from '@/shared/i18n/I18nProvider';
import { appTheme } from '@/shared/theme/theme';
import { NotificationProvider } from '@/shared/ui/notifications/NotificationProvider';

// Layer order lets Tailwind utilities override MUI styles (MUI + Tailwind v4 integration guide).
const CSS_LAYER_ORDER = '@layer theme, base, mui, components, utilities;';

export const AppProviders = ({ children }: Readonly<{ children: ReactNode }>) => (
  <StyledEngineProvider enableCssLayer>
    <GlobalStyles styles={CSS_LAYER_ORDER} />
    <ThemeProvider theme={appTheme} defaultMode="system">
      <CssBaseline />
      <I18nProvider>
        <NotificationProvider>
          <SessionProvider>{children}</SessionProvider>
        </NotificationProvider>
      </I18nProvider>
    </ThemeProvider>
  </StyledEngineProvider>
);
