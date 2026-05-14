import { useState } from 'react';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '@/shared/config/firebase';
import { passwordRegex, PASSWORD_VALIDATION_MESSAGE } from '@/shared/constants/validation';

export const useUpdatePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetState = () => {
    setError('');
    setSuccess('');
  };

  const handleUpdate = async (oldPassword: string, newPassword: string, onSuccess?: () => void) => {
    resetState();
    if (!auth.currentUser || !auth.currentUser.email) {
      setError('Usuário não autenticado.');
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      setError(PASSWORD_VALIDATION_MESSAGE);
      return;
    }

    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, oldPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      
      setSuccess('Senha atualizada com sucesso!');
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (err: any) {
      setError('Falha ao atualizar a senha. Verifique sua senha antiga.');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, handleUpdate, resetState };
};
