import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useColorScheme } from '@mui/material/styles';
import { useTranslation } from '@/shared/i18n/useTranslation';

export const ThemeModeToggle = () => {
  const { mode, systemMode, setMode } = useColorScheme();
  const { t } = useTranslation();

  if (!mode) return null;

  const isDark = (mode === 'system' ? systemMode : mode) === 'dark';
  const label = isDark ? t('common.lightMode') : t('common.darkMode');

  return (
    <Tooltip title={label}>
      <IconButton aria-label={label} onClick={() => setMode(isDark ? 'light' : 'dark')} size="small">
        {isDark ? <LightModeOutlined fontSize="small" /> : <DarkModeOutlined fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
};
