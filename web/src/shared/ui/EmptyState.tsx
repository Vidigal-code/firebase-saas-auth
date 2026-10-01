import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: Readonly<EmptyStateProps>) => (
  <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-divider px-6 py-14 text-center">
    <div className="text-5xl text-text-secondary opacity-60">{icon}</div>
    <Typography variant="h6" component="p">
      {title}
    </Typography>
    {description && (
      <Typography variant="body2" color="text.secondary" className="max-w-md">
        {description}
      </Typography>
    )}
    {action}
  </div>
);
