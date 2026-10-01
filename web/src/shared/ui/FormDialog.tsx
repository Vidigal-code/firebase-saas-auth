import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useId, type SubmitEventHandler, type ReactNode } from 'react';
import { useTranslation } from '@/shared/i18n/useTranslation';

export interface FormDialogProps {
  title: string;
  submitLabel: string;
  isPending: boolean;
  errorMessage?: string | null;
  maxWidth?: 'xs' | 'sm';
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  onClose: () => void;
  children: ReactNode;
}

// Rendered only while open (parents mount it conditionally) so forms start fresh.
export const FormDialog = ({
  title,
  submitLabel,
  isPending,
  errorMessage,
  maxWidth = 'xs',
  onSubmit,
  onClose,
  children,
}: Readonly<FormDialogProps>) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const titleId = useId();

  return (
    <Dialog
      open
      onClose={isPending ? undefined : onClose}
      aria-labelledby={titleId}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={isMobile}
    >
      <form onSubmit={onSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
        <DialogTitle id={titleId}>{title}</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 pt-2">
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            {children}
          </div>
        </DialogContent>
        <DialogActions className="px-6 pb-4">
          <Button onClick={onClose} disabled={isPending}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? t('common.saving') : submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
