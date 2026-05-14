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
import { passwordRegex, PASSWORD_VALIDATION_MESSAGE } from '@/shared/constants/validation';
import { BRAND } from '@/shared/constants/theme';

interface RegisterFormData { email: string; password: string }

const schema = yup.object({
  email:    yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().matches(passwordRegex, PASSWORD_VALIDATION_MESSAGE).required('Senha é obrigatória'),
}).required();

const REGISTER_ERROR_MESSAGE = 'Falha ao criar conta. O email pode já estar em uso.';
const PASSWORD_HINT = 'Mín. 8 caracteres, maiúscula, minúscula, número e especial';

const createUserDocument = (uid: string, email: string) =>
  setDoc(doc(db, 'users', uid), { email, createdAt: new Date().toISOString(), role: 'CLIENT' });

export const RegisterPage = () => {
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

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
      setServerError(REGISTER_ERROR_MESSAGE);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: BRAND.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, mx: 'auto', mb: 1.5 }}>
          <FiUserPlus />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem' }}>Criar nova conta</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, fontSize: '0.78rem' }}>
          {`Comece a usar o ${BRAND.name} gratuitamente`}
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {serverError && <Alert severity="error" sx={{ borderRadius: '8px', py: 0.5 }}>{serverError}</Alert>}
        <TextField label="Email" type="email" size="small" fullWidth {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
        <TextField
          label="Senha" type="password" size="small" fullWidth {...register('password')}
          error={!!errors.password} helperText={errors.password?.message ?? PASSWORD_HINT}
        />
        <Button type="submit" fullWidth variant="contained" disabled={isSubmitting} sx={{ py: 1.25, mt: 0.5 }}>
          {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.78rem' }}>
        {'Já tem uma conta? '}
        <Link to="/login" style={{ color: 'inherit', fontWeight: 700 }}>Fazer login</Link>
      </Typography>
    </Box>
  );
};
