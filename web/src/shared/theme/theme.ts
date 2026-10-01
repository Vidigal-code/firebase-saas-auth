import { createTheme } from '@mui/material/styles';

const FONT_FAMILY = "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";
const BORDER_RADIUS = 12;
const SEMIBOLD = 600;

const BRAND = {
  primary: { light: '#4f46e5', dark: '#818cf8' },
  secondary: { light: '#7c3aed', dark: '#a78bfa' },
} as const;

// Single source of the color tokens: MUI emits them as CSS variables
// (--mui-palette-*) and Tailwind maps them in app/styles/global.css.
export const appTheme = createTheme({
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: BRAND.primary.light },
        secondary: { main: BRAND.secondary.light },
        background: { default: '#f8fafc', paper: '#ffffff' },
        text: { primary: '#0f172a', secondary: '#475569' },
        divider: '#e2e8f0',
      },
    },
    dark: {
      palette: {
        primary: { main: BRAND.primary.dark },
        secondary: { main: BRAND.secondary.dark },
        background: { default: '#0b1020', paper: '#121a2f' },
        text: { primary: '#f1f5f9', secondary: '#94a3b8' },
        divider: '#22304d',
      },
    },
  },
  shape: { borderRadius: BORDER_RADIUS },
  typography: {
    fontFamily: FONT_FAMILY,
    button: { textTransform: 'none', fontWeight: SEMIBOLD },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiCard: { defaultProps: { variant: 'outlined' } },
    MuiTextField: { defaultProps: { fullWidth: true } },
    MuiChip: { styleOverrides: { root: { fontWeight: SEMIBOLD } } },
  },
});
