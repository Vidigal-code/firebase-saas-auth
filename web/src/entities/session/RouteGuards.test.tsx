import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';
import { I18nProvider } from '@/shared/i18n/I18nProvider';
import { AUTHENTICATED } from '@/test/renderWithProviders';
import { RequireAuth, RequireGuest } from './RouteGuards';
import { SessionContext, type Session } from './sessionContext';

const renderRoutes = (session: Session, path: string) =>
  render(
    <I18nProvider>
      <SessionContext.Provider value={session}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route element={<RequireGuest />}>
              <Route path="/login" element={<p>login page</p>} />
            </Route>
            <Route element={<RequireAuth />}>
              <Route path="/connections" element={<p>connections page</p>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </SessionContext.Provider>
    </I18nProvider>,
  );

describe('route guards', () => {
  it('sends anonymous visitors of private pages to the login', () => {
    renderRoutes({ status: 'anonymous' }, '/connections');
    expect(screen.getByText('login page')).toBeInTheDocument();
  });

  it('lets signed-in clients into private pages', () => {
    renderRoutes(AUTHENTICATED, '/connections');
    expect(screen.getByText('connections page')).toBeInTheDocument();
  });

  it('sends signed-in clients away from the login', () => {
    renderRoutes(AUTHENTICATED, '/login');
    expect(screen.getByText('connections page')).toBeInTheDocument();
  });

  it('waits for the session before deciding', () => {
    renderRoutes({ status: 'loading' }, '/connections');
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
