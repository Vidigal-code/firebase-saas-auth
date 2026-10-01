import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { useConnection } from '@/entities/connection/model/useConnections';
import { buildContactsPath, CONNECTION_SEGMENTS, ROUTES } from '@/shared/config/routes';
import { renderWithProviders, TEST_USER } from '@/test/renderWithProviders';
import { ConnectionLayout } from './ConnectionLayout';
import { useConnectionContext } from './connectionContext';

vi.mock('@/entities/connection/model/useConnections', () => ({ useConnection: vi.fn() }));

const CONNECTION_ID = 'conn-1';

const ChildPage = () => {
  const { connection, scope } = useConnectionContext();
  return <p>{`child of ${connection.name} for ${scope.clientId}`}</p>;
};

const renderLayout = () =>
  renderWithProviders(
    <Routes>
      <Route path={ROUTES.connection} element={<ConnectionLayout />}>
        <Route path={CONNECTION_SEGMENTS.contacts} element={<ChildPage />} />
      </Route>
    </Routes>,
    { route: buildContactsPath(CONNECTION_ID) },
  );

describe('ConnectionLayout', () => {
  it('provides the connection and tenant scope to its pages', () => {
    vi.mocked(useConnection).mockReturnValue({
      status: 'ready',
      error: null,
      data: { id: CONNECTION_ID, name: 'Vendas', createdAt: new Date() },
    });
    renderLayout();

    expect(useConnection).toHaveBeenCalledWith(CONNECTION_ID);
    expect(screen.getByRole('heading', { name: 'Vendas' })).toBeInTheDocument();
    expect(screen.getByText(`child of Vendas for ${TEST_USER.uid}`)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Contatos' })).toHaveAttribute('aria-selected', 'true');
  });

  it('treats a connection the rules refuse to read as not found', () => {
    vi.mocked(useConnection).mockReturnValue({ status: 'error', error: null, data: null });
    renderLayout();

    expect(screen.getByText('Conexão não encontrada')).toBeInTheDocument();
    expect(screen.queryByText(/child of/)).not.toBeInTheDocument();
  });
});
