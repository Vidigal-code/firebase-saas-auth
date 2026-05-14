import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/shared/config/firebase';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Alert, Box, Typography } from '@mui/material';
import { FiLogIn } from 'react-icons/fi';
import { BRAND } from '@/shared/constants/theme';

interface LoginFormData { email: string; password: string }

const schema = yup.object({
  email:    yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().required('Senha é obrigatória'),
}).required();

const AUTH_ERROR_MESSAGE = 'Credenciais inválidas. Verifique seu email e senha.';

export const LoginPage = () => {
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async ({ email, password }: LoginFormData) => {
    try {
      setServerError('');
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/connections');
    } catch {
      setServerError(AUTH_ERROR_MESSAGE);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: BRAND.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, mx: 'auto', mb: 1.5 }}>
          <FiLogIn />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem' }}>Bem-vindo de volta</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, fontSize: '0.78rem' }}>
          Entre na sua conta para continuar
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {serverError && <Alert severity="error" sx={{ borderRadius: '8px', py: 0.5 }}>{serverError}</Alert>}
        <TextField label="Email" type="email" size="small" fullWidth {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
        <TextField label="Senha" type="password" size="small" fullWidth {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
        <Button type="submit" fullWidth variant="contained" disabled={isSubmitting} sx={{ py: 1.25, mt: 0.5 }}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.78rem' }}>
        {'Não tem uma conta? '}
        <Link to="/register" style={{ color: 'inherit', fontWeight: 700 }}>Criar conta grátis</Link>
      </Typography>
    </Box>
  );
};
