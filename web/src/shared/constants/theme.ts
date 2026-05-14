export const THEME_STORAGE_KEY = 'broadcastapp:theme';

export const DARK_PALETTE = {
  primary:       '#6366f1',
  secondary:     '#8b5cf6',
  accent:        '#06b6d4',
  success:       '#10b981',
  warning:       '#f59e0b',
  error:         '#ef4444',
  bgDefault:     '#0a0f1e',
  bgPaper:       '#111827',
  bgSurface:     '#1a2236',
  bgBorder:      '#1e2d45',
  textPrimary:   '#f1f5f9',
  textSecondary: '#94a3b8',
} as const;

export const LIGHT_PALETTE = {
  primary:       '#4f46e5',
  secondary:     '#7c3aed',
  accent:        '#0891b2',
  success:       '#059669',
  warning:       '#d97706',
  error:         '#dc2626',
  bgDefault:     '#f8fafc',
  bgPaper:       '#ffffff',
  bgSurface:     '#f1f5f9',
  bgBorder:      '#e2e8f0',
  textPrimary:   '#0f172a',
  textSecondary: '#64748b',
} as const;

export const LAYOUT = {
  sidebarWidth: 260,
  headerHeight: 56,
  maxContentWidth: 1200,
  borderRadius: 12,
  borderRadiusSm: 8,
} as const;

export const BRAND = {
  name: 'BroadcastApp',
  gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  author: 'Vidigal-code',
  authorUrl: 'https://github.com/Vidigal-code',
} as const;
