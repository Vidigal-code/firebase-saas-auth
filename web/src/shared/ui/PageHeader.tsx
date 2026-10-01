import Typography, { type TypographyProps } from '@mui/material/Typography';
import type { ReactNode } from 'react';

export type PageHeadingLevel = 'h1' | 'h2';

const HEADING_VARIANTS: Record<PageHeadingLevel, TypographyProps['variant']> = {
  h1: 'h5',
  h2: 'h6',
};

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  headingLevel?: PageHeadingLevel;
}

export const PageHeader = ({ title, subtitle, actions, headingLevel = 'h1' }: Readonly<PageHeaderProps>) => (
  <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="min-w-0 text-center sm:text-left">
      <Typography variant={HEADING_VARIANTS[headingLevel]} component={headingLevel} className="truncate font-bold">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </div>
    {actions && <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap *:w-full sm:*:w-auto">{actions}</div>}
  </header>
);
