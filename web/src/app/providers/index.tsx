import { createContext, useState, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { store } from '../store';
import { ENV } from '@/shared/config/env';
import {
  DARK_PALETTE,
  LIGHT_PALETTE,
  THEME_STORAGE_KEY,
  LAYOUT,
} from '@/shared/constants/theme';

type ThemeMode = 'light' | 'dark';

interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleColorMode: () => void;
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000 } },
});

export const ThemeModeContext = createContext<ThemeModeContextValue>({
  toggleColorMode: () => {},
  mode: 'dark',
});

const resolveInitialMode = (): ThemeMode => {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return (ENV.START_THEME as ThemeMode) || 'dark';
};

const syncDocumentClass = (mode: ThemeMode) => {
  if (mode === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const buildMuiTheme = (mode: ThemeMode) => {
  const p = mode === 'dark' ? DARK_PALETTE : LIGHT_PALETTE;
  return createTheme({
    palette: {
      mode,
      primary:   { main: p.primary },
      secondary: { main: p.secondary },
      error:     { main: p.error },
      warning:   { main: p.warning },
      success:   { main: p.success },
      background: { default: p.bgDefault, paper: p.bgPaper },
      text: {
        primary:   p.textPrimary,
        secondary: p.textSecondary,
      },
      divider: p.bgBorder,
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      h1: { fontWeight: 800 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: LAYOUT.borderRadius,
            padding: '8px 20px',
          },
          contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${p.bgBorder}`,
            boxShadow: 'none',
            borderRadius: LAYOUT.borderRadius,
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              borderColor: p.primary,
              boxShadow: `0 4px 24px ${mode === 'dark' ? 'rgba(99,102,241,0.15)' : 'rgba(79,70,229,0.12)'}`,
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
            backgroundColor: p.bgPaper,
            border: `1px solid ${p.bgBorder}`,
            borderRadius: LAYOUT.borderRadius,
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            color: p.textPrimary,
            fontWeight: 700,
          },
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: { color: p.textPrimary },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined', size: 'medium' },
        styleOverrides: {
          root: { borderRadius: LAYOUT.borderRadiusSm },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            color: p.textPrimary,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: p.bgBorder,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: p.textSecondary,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: p.primary,
            },
          },
          input: {
            color: p.textPrimary,
            '&::placeholder': {
              color: p.textSecondary,
              opacity: 1,
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: p.textSecondary,
            '&.Mui-focused': {
              color: p.primary,
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          icon: { color: p.textSecondary },
          select: { color: p.textPrimary },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            color: p.textPrimary,
            '&::placeholder': {
              color: p.textSecondary,
              opacity: 1,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: p.bgPaper,
            border: `1px solid ${p.bgBorder}`,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: { color: p.textPrimary },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: { color: p.textPrimary },
          secondary: { color: p.textSecondary },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: { backgroundColor: p.bgSurface },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { color: p.textPrimary, borderColor: p.bgBorder },
          head: { fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: p.textSecondary },
        },
      },
      MuiChip: {
        styleOverrides: { root: { fontWeight: 600, borderRadius: 6 } },
      },
      MuiIconButton: {
        styleOverrides: {
          root: { borderRadius: LAYOUT.borderRadiusSm },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: { backgroundColor: p.primary },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            color: p.textSecondary,
            '&.Mui-selected': { color: p.primary },
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: { color: p.textSecondary },
        },
      },
      MuiPagination: {
        styleOverrides: {
          root: {
            '& .MuiPaginationItem-root': {
              color: p.textPrimary,
              borderColor: p.bgBorder,
            },
          },
        },
      },
    },
  });
};

interface AppProvidersProps { children: ReactNode; }

export const AppProviders = ({ children }: AppProvidersProps) => {
  const [mode, setMode] = useState<ThemeMode>(resolveInitialMode);

  useEffect(() => { syncDocumentClass(mode); }, [mode]);

  const colorMode = useMemo<ThemeModeContextValue>(() => ({
    mode,
    toggleColorMode: () => {
      setMode(prev => {
        const next = prev === 'light' ? 'dark' : 'light';
        localStorage.setItem(THEME_STORAGE_KEY, next);
        syncDocumentClass(next);
        return next;
      });
    },
  }), [mode]);

  const theme = useMemo(() => buildMuiTheme(mode), [mode]);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </ThemeModeContext.Provider>
      </QueryClientProvider>
    </Provider>
  );
};
