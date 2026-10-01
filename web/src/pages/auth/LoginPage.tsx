import { signIn } from '@/features/auth/model/authService';
import { loginSchema } from '@/features/auth/model/credentials';
import { AuthCard } from '@/features/auth/ui/AuthCard';
import { CredentialsForm } from '@/features/auth/ui/CredentialsForm';
import { ROUTES } from '@/shared/config/routes';
import { useTranslation } from '@/shared/i18n/useTranslation';

// Navigation after success is handled by <RequireGuest> reacting to the new session.
export const LoginPage = () => {
  const { t } = useTranslation();

  return (
    <AuthCard
      title={t('auth.loginTitle')}
      subtitle={t('auth.loginSubtitle')}
      footerText={t('auth.noAccount')}
      footerLinkLabel={t('common.register')}
      footerLinkTo={ROUTES.register}
    >
      <CredentialsForm
        schema={loginSchema}
        submitLabel={t('auth.loginButton')}
        pendingLabel={t('auth.loginPending')}
        passwordAutoComplete="current-password"
        onSubmit={signIn}
      />
    </AuthCard>
  );
};
