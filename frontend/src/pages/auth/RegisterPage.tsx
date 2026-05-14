import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/shared/config/firebase';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Alert } from '@mui/material';

const schema = yup.object({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres').required('Senha é obrigatória'),
}).required();

interface FormData {
  email: string;
  password: string;
}

export const RegisterPage = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError('');
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: data.email,
        createdAt: new Date().toISOString(),
        role: 'CLIENT', 
      });

      navigate('/connections');
    } catch (err: any) {
      setError('Falha ao criar conta. Tente novamente.');
    }
  };

  return (
    <div>
      <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
        Criar nova conta
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Ou{' '}
        <Link to="/login" className="font-medium text-primary hover:text-secondary transition-colors">
          faça login na sua conta
        </Link>
      </p>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {error && <Alert severity="error">{error}</Alert>}
        
        <div className="space-y-4">
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            fullWidth
            type="password"
            label="Senha"
            variant="outlined"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        </div>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          disabled={isSubmitting}
          className="bg-primary hover:bg-secondary"
        >
          {isSubmitting ? 'Criando conta...' : 'Cadastrar'}
        </Button>
      </form>
    </div>
  );
};
