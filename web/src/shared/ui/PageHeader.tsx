import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  headingLevel?: 'h1' | 'h2';
}

export const PageHeader = ({ title, subtitle, actions, headingLevel = 'h1' }: Readonly<PageHeaderProps>) => (
  <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="min-w-0">
      <Typography variant={headingLevel === 'h1' ? 'h5' : 'h6'} component={headingLevel} className="truncate font-bold">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </div>
    {actions && <div className="flex flex-wrap gap-2 *:flex-1 sm:*:flex-none">{actions}</div>}
  </header>
);
