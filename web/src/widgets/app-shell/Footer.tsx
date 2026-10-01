import Typography from '@mui/material/Typography';
import { useTranslation } from '@/shared/i18n/useTranslation';

const AUTHOR = { name: 'Vidigal-code', url: 'https://github.com/Vidigal-code' } as const;

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-divider bg-background-paper px-4 py-3">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 sm:justify-between">
        <Typography variant="caption" color="text.secondary">
          {`${t('common.creator')} `}
          <a
            href={AUTHOR.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-primary no-underline hover:underline"
          >
            {AUTHOR.name}
          </a>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {`${t('common.appName')} © ${new Date().getFullYear()}`}
        </Typography>
      </div>
    </footer>
  );
};
