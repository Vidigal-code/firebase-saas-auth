import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FirebaseError } from 'firebase/app';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/renderWithProviders';
import { loginSchema } from '../model/credentials';
import { CredentialsForm } from './CredentialsForm';

const renderForm = (onSubmit: () => Promise<unknown>) =>
  renderWithProviders(
    <CredentialsForm
      schema={loginSchema}
      submitLabel="Entrar"
      pendingLabel="Entrando..."
      passwordAutoComplete="current-password"
      onSubmit={onSubmit}
    />,
  );

describe('CredentialsForm', () => {
  it('submits normalized credentials', async () => {
    const onSubmit = vi.fn(() => Promise.resolve());
    renderForm(onSubmit);

    await userEvent.type(screen.getByLabelText('E-mail'), 'Ana@Example.com');
    await userEvent.type(screen.getByLabelText('Senha'), 'secret');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ email: 'ana@example.com', password: 'secret' }));
  });

  it('translates Firebase Auth failures', async () => {
    renderForm(() => Promise.reject(new FirebaseError('auth/invalid-credential', 'denied')));

    await userEvent.type(screen.getByLabelText('E-mail'), 'ana@example.com');
    await userEvent.type(screen.getByLabelText('Senha'), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('E-mail ou senha incorretos.')).toBeInTheDocument();
  });
});
