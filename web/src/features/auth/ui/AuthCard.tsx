import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { Link } from 'react-router';

export interface AuthCardProps {
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkLabel: string;
  footerLinkTo: string;
  children: ReactNode;
}

export const AuthCard = ({
  title,
  subtitle,
  footerText,
  footerLinkLabel,
  footerLinkTo,
  children,
}: Readonly<AuthCardProps>) => (
  <div className="flex flex-1 items-center justify-center">
    <Card className="flex w-full max-w-md flex-col gap-6 p-6 sm:p-8">
      <div className="text-center">
        <Typography variant="h5" component="h1" className="font-extrabold">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mt-1">
          {subtitle}
        </Typography>
      </div>
      {children}
      <Typography variant="body2" color="text.secondary" className="text-center">
        {`${footerText} `}
        <Link to={footerLinkTo} className="font-bold text-primary no-underline hover:underline">
          {footerLinkLabel}
        </Link>
      </Typography>
    </Card>
  </div>
);
