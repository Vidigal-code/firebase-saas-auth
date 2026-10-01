import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { register, signIn } from '@/features/auth/model/authService';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { HomePage } from '@/pages/home/HomePage';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';
import { ROUTES } from '@/shared/config/routes';
import { renderWithProviders } from '@/test/renderWithProviders';
import { PublicLayout } from './PublicLayout';

vi.mock('@/features/auth/model/authService', () => ({
  signIn: vi.fn(() => Promise.resolve()),
  register: vi.fn(() => Promise.resolve()),
}));

const PASSWORD = 'Str0ng!Pass';
const FEATURE_COUNT = 6;

const submitCredentials = async (email: string, submitLabel: string) => {
  await userEvent.type(screen.getByLabelText('E-mail'), email);
  await userEvent.type(screen.getByLabelText('Senha'), PASSWORD);
  await userEvent.click(screen.getAllByRole('button', { name: submitLabel }).at(-1) as HTMLElement);
};

const renderPublic = (route: string) =>
  renderWithProviders(
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>,
    { route, session: { status: 'anonymous' } },
  );

describe('public pages', () => {
  it('presents the product on the home page', () => {
    renderPublic(ROUTES.home);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Envie mensagens para seus contatos');
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(FEATURE_COUNT);
    expect(screen.getByRole('link', { name: /Começar grátis/ })).toHaveAttribute('href', ROUTES.register);
  });

  it('signs a client in', async () => {
    renderPublic(ROUTES.login);

    const email = 'ana@example.com';
    await submitCredentials(email, 'Entrar');

    await waitFor(() => expect(signIn).toHaveBeenCalledWith({ email, password: PASSWORD }));
  });

  it('registers a new client with a strong password', async () => {
    renderPublic(ROUTES.register);

    const email = 'novo@example.com';
    await submitCredentials(email, 'Criar conta');

    await waitFor(() => expect(register).toHaveBeenCalledWith({ email, password: PASSWORD }));
  });

  it('shows a not found page for unknown addresses', () => {
    renderPublic('/nao-existe');

    expect(screen.getByRole('heading', { name: 'Página não encontrada' })).toBeInTheDocument();
  });
});
