import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { useFieldError } from '@/shared/i18n/useFieldError';
import { useTranslation } from '@/shared/i18n/useTranslation';
import type { TranslationKey } from '@/shared/i18n/translate';
import { toAuthErrorKey } from '../model/authErrors';
import type { Credentials } from '../model/credentials';

export interface CredentialsFormProps {
  schema: z.ZodType<Credentials, Credentials>;
  submitLabel: string;
  pendingLabel: string;
  passwordHint?: string;
  passwordAutoComplete: 'current-password' | 'new-password';
  onSubmit: (credentials: Credentials) => Promise<unknown>;
}

const EMPTY_CREDENTIALS: Credentials = { email: '', password: '' };

export const CredentialsForm = ({
  schema,
  submitLabel,
  pendingLabel,
  passwordHint,
  passwordAutoComplete,
  onSubmit,
}: Readonly<CredentialsFormProps>) => {
  const { t } = useTranslation();
  const fieldError = useFieldError();
  const [serverError, setServerError] = useState<TranslationKey | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Credentials>({ resolver: zodResolver(schema), defaultValues: EMPTY_CREDENTIALS });

  const submit = handleSubmit(async (credentials) => {
    setServerError(null);
    try {
      await onSubmit(credentials);
    } catch (error) {
      setServerError(toAuthErrorKey(error));
    }
  });

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      {serverError && <Alert severity="error">{t(serverError)}</Alert>}
      <TextField
        label={t('auth.email')}
        type="email"
        autoComplete="email"
        autoFocus
        {...register('email')}
        error={Boolean(errors.email)}
        helperText={fieldError(errors.email)}
      />
      <TextField
        label={t('auth.password')}
        type="password"
        autoComplete={passwordAutoComplete}
        {...register('password')}
        error={Boolean(errors.password)}
        helperText={fieldError(errors.password) ?? passwordHint}
      />
      <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
        {isSubmitting ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
};
