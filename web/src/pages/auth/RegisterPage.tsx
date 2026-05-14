import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/shared/config/firebase';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Alert, Box, Typography } from '@mui/material';
import { FiUserPlus } from 'react-icons/fi';
import { passwordRegex } from '@/shared/constants/validation';
import { useLang } from '@/shared/hooks/useLang';
import { BRAND } from '@/shared/constants/theme';

interface RegisterFormData { email: string; password: string }

const createUserDocument = (uid: string, email: string) =>
  setDoc(doc(db, 'users', uid), { email, createdAt: new Date().toISOString(), role: 'CLIENT' });

export const RegisterPage = () => {
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const { t } = useLang();

  const schema = yup.object({
    email:    yup.string().email(t.auth.emailInvalid).required(t.auth.emailRequired),
    password: yup.string().matches(passwordRegex, t.auth.passwordValidation).required(t.auth.passwordRequired),
  }).required();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async ({ email, password }: RegisterFormData) => {
    try {
      setServerError('');
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await createUserDocument(user.uid, email);
      navigate('/connections');
    } catch {
      setServerError(t.auth.registerError);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: BRAND.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, mx: 'auto', mb: 1.5 }}>
          <FiUserPlus />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem' }}>{t.auth.registerTitle}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, fontSize: '0.78rem' }}>
          {t.auth.registerSubtitle.replace('{brand}', BRAND.name)}
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {serverError && <Alert severity="error" sx={{ borderRadius: '8px', py: 0.5 }}>{serverError}</Alert>}
        <TextField label={t.auth.emailLabel} type="email" size="small" fullWidth {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
        <TextField
          label={t.auth.passwordLabel} type="password" size="small" fullWidth {...register('password')}
          error={!!errors.password} helperText={errors.password?.message ?? t.auth.passwordHint}
        />
        <Button type="submit" fullWidth variant="contained" disabled={isSubmitting} sx={{ py: 1.25, mt: 0.5 }}>
          {isSubmitting ? t.auth.registerLoading : t.auth.registerButton}
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.78rem' }}>
        {`${t.auth.hasAccount} `}
        <Link to="/login" style={{ color: 'inherit', fontWeight: 700 }}>{t.auth.doLogin}</Link>
      </Typography>
    </Box>
  );
};
