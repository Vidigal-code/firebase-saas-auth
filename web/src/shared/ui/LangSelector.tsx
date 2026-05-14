import { useContext } from 'react';
import { useCallback } from 'react';
import { Select, MenuItem, IconButton, Tooltip, Box, type SelectChangeEvent } from '@mui/material';
import { FiSun, FiMoon } from 'react-icons/fi';
import { ThemeModeContext } from '@/app/providers';
import { useLang } from '@/shared/hooks/useLang';
import { SUPPORTED_LANGS, type Lang } from '@/shared/config/i18n';
import { LAYOUT } from '@/shared/constants/theme';

interface LangSelectorProps {
  fullWidth?: boolean;
}

export const LangSelector = ({ fullWidth }: LangSelectorProps) => {
  const { lang, t, setLang } = useLang();

  const handleChange = useCallback(
    (e: SelectChangeEvent<string>) => setLang(e.target.value as Lang),
    [setLang],
  );

  return (
    <Select
      value={lang}
      onChange={handleChange}
      size="small"
      variant="outlined"
      fullWidth={fullWidth}
      sx={{
        minWidth: 0,
        fontSize: '0.75rem',
        fontWeight: 600,
        borderRadius: `${LAYOUT.borderRadiusSm}px`,
        '& .MuiSelect-select': { py: 0.5, px: 1, pr: '24px !important' },
        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
      }}
    >
      {SUPPORTED_LANGS.map(code => (
        <MenuItem key={code} value={code} sx={{ fontSize: '0.8rem' }}>
          {t.lang.menu[code]}
        </MenuItem>
      ))}
    </Select>
  );
};

interface ThemeToggleButtonProps {
  size?: number;
}

export const ThemeToggleButton = ({ size = 15 }: ThemeToggleButtonProps) => {
  const { mode, toggleColorMode } = useContext(ThemeModeContext);
  const { t } = useLang();

  return (
    <Tooltip title={mode === 'dark' ? t.common.lightMode : t.common.darkMode}>
      <IconButton
        onClick={toggleColorMode}
        size="small"
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: `${LAYOUT.borderRadiusSm}px`,
          width: 36,
          height: 36,
        }}
      >
        {mode === 'dark' ? <FiSun size={size} /> : <FiMoon size={size} />}
      </IconButton>
    </Tooltip>
  );
};

export const LangThemeBar = () => (
  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 1, alignItems: 'center', width: '100%' }}>
    <LangSelector fullWidth />
    <ThemeToggleButton />
  </Box>
);
