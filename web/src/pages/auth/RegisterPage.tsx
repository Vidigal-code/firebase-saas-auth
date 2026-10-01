import { register } from '@/features/auth/model/authService';
import { registerSchema } from '@/features/auth/model/credentials';
import { AuthCard } from '@/features/auth/ui/AuthCard';
import { CredentialsForm } from '@/features/auth/ui/CredentialsForm';
import { ROUTES } from '@/shared/config/routes';
import { useTranslation } from '@/shared/i18n/useTranslation';

export const RegisterPage = () => {
  const { t } = useTranslation();

  return (
    <AuthCard
      title={t('auth.registerTitle')}
      subtitle={t('auth.registerSubtitle')}
      footerText={t('auth.hasAccount')}
      footerLinkLabel={t('common.login')}
      footerLinkTo={ROUTES.login}
    >
      <CredentialsForm
        schema={registerSchema}
        submitLabel={t('auth.registerButton')}
        pendingLabel={t('auth.registerPending')}
        passwordHint={t('auth.passwordHint')}
        passwordAutoComplete="new-password"
        onSubmit={register}
      />
    </AuthCard>
  );
};
