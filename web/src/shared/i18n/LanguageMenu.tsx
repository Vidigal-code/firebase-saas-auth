import TranslateOutlined from '@mui/icons-material/TranslateOutlined';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { useState, type MouseEvent } from 'react';
import { LANGUAGES, type Language } from './translate';
import { useTranslation } from './useTranslation';

export const LanguageMenu = () => {
  const { language, setLanguage, t } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const label = t('common.language');

  const openMenu = (event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget);
  const closeMenu = () => setAnchor(null);
  const choose = (next: Language) => {
    setLanguage(next);
    closeMenu();
  };

  return (
    <>
      <Tooltip title={label}>
        <IconButton aria-label={label} aria-haspopup="menu" onClick={openMenu} size="small">
          <TranslateOutlined fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={closeMenu}>
        {LANGUAGES.map((option) => (
          <MenuItem key={option} selected={option === language} onClick={() => choose(option)}>
            {t(`lang.${option}`)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
