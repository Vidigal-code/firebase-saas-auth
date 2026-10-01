import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { changePassword, signOut } from '@/features/auth/model/authService';
import { ROUTES } from '@/shared/config/routes';
import { renderWithProviders, TEST_USER } from '@/test/renderWithProviders';
import { DashboardLayout } from './DashboardLayout';

vi.mock('@/features/auth/model/authService', () => ({
  signOut: vi.fn(() => Promise.resolve()),
  changePassword: vi.fn(() => Promise.resolve()),
}));

const CURRENT_PASSWORD = 'Old!Pass1';
const NEW_PASSWORD = 'N3w!Password';
const NEW_PASSWORD_LABEL = 'Nova senha';
const CHANGE_PASSWORD_LABEL = 'Alterar senha';
const LOGOUT_LABEL = 'Sair';
const LANGUAGE_LABEL = 'Idioma';

const openAccountMenu = () => userEvent.click(screen.getByRole('button', { name: 'Abrir menu da conta' }));
const submitPassword = () => userEvent.click(screen.getByRole('button', { name: 'Atualizar senha' }));

const openNavigationDrawer = async () => {
  await userEvent.click(screen.getByRole('button', { name: 'Abrir menu de navegação' }));
  return within(screen.getByRole('dialog', { name: 'Menu' }));
};

const renderDashboard = () =>
  renderWithProviders(
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path={ROUTES.connections} element={<p>page content</p>} />
      </Route>
    </Routes>,
    { route: ROUTES.connections },
  );

describe('DashboardLayout', () => {
  it('renders the page inside the app shell', () => {
    renderDashboard();

    expect(screen.getByText('page content')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'BroadcastApp' })).toHaveAttribute('href', ROUTES.connections);
  });

  it('shows the signed-in account and signs out', async () => {
    renderDashboard();

    await openAccountMenu();
    expect(screen.getByText(TEST_USER.email)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('menuitem', { name: LOGOUT_LABEL }));

    expect(signOut).toHaveBeenCalled();
  });

  it('changes the password after validating the new one', async () => {
    renderDashboard();

    await openAccountMenu();
    await userEvent.click(screen.getByRole('menuitem', { name: CHANGE_PASSWORD_LABEL }));
    await userEvent.type(screen.getByLabelText('Senha atual'), CURRENT_PASSWORD);
    await userEvent.type(screen.getByLabelText(NEW_PASSWORD_LABEL), 'weak');
    await submitPassword();
    expect(await screen.findByText(/Mínimo de 8 caracteres/)).toBeInTheDocument();

    await userEvent.clear(screen.getByLabelText(NEW_PASSWORD_LABEL));
    await userEvent.type(screen.getByLabelText(NEW_PASSWORD_LABEL), NEW_PASSWORD);
    await submitPassword();

    await waitFor(() =>
      expect(changePassword).toHaveBeenCalledWith({ currentPassword: CURRENT_PASSWORD, newPassword: NEW_PASSWORD }),
    );
    expect(await screen.findByText('Senha atualizada com sucesso.')).toBeInTheDocument();
  });

  it('switches language and theme', async () => {
    renderDashboard();

    await userEvent.click(screen.getByRole('button', { name: LANGUAGE_LABEL }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'English' }));
    expect(screen.getByRole('button', { name: 'Open account menu' })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('en-US');

    await userEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
  });

  it('offers account actions in the mobile navigation menu', async () => {
    renderDashboard();

    const drawer = await openNavigationDrawer();
    expect(drawer.getByText(TEST_USER.email)).toBeInTheDocument();
    expect(drawer.getByRole('button', { name: LANGUAGE_LABEL })).toBeInTheDocument();
    await userEvent.click(drawer.getByRole('button', { name: LOGOUT_LABEL }));

    expect(signOut).toHaveBeenCalled();
  });

  it('opens the password dialog from the mobile navigation menu', async () => {
    renderDashboard();

    const drawer = await openNavigationDrawer();
    await userEvent.click(drawer.getByRole('button', { name: CHANGE_PASSWORD_LABEL }));

    expect(await screen.findByRole('dialog', { name: CHANGE_PASSWORD_LABEL })).toBeInTheDocument();
  });
});
