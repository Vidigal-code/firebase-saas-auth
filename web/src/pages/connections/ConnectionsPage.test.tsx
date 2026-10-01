import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { deleteConnection } from '@/entities/connection/api/connectionsRepository';
import { useConnections } from '@/entities/connection/model/useConnections';
import { renderWithProviders } from '@/test/renderWithProviders';
import { ConnectionsPage } from './ConnectionsPage';

vi.mock('@/entities/connection/api/connectionsRepository', () => ({
  createConnection: vi.fn(() => Promise.resolve()),
  updateConnection: vi.fn(() => Promise.resolve()),
  deleteConnection: vi.fn(() => Promise.resolve()),
}));
vi.mock('@/entities/connection/model/useConnections', () => ({ useConnections: vi.fn() }));

const CONNECTIONS = [
  { id: 'conn-1', name: 'Vendas', createdAt: new Date(2026, 9, 1) },
  { id: 'conn-2', name: 'Suporte', createdAt: new Date(2026, 8, 30) },
];

const mockConnections = (result: Partial<ReturnType<typeof useConnections>>) =>
  vi.mocked(useConnections).mockReturnValue({ status: 'ready', data: [], error: null, ...result });

describe('ConnectionsPage', () => {
  it('lists the client connections with links to contacts and broadcast', () => {
    mockConnections({ data: CONNECTIONS });
    renderWithProviders(<ConnectionsPage />);

    expect(screen.getByText('2 conexão(ões) cadastrada(s)')).toBeInTheDocument();
    const card = screen.getByRole('heading', { name: 'Vendas' }).closest('article');
    expect(within(card as HTMLElement).getByRole('link', { name: 'Broadcast' })).toHaveAttribute(
      'href',
      '/connections/conn-1/broadcast',
    );
  });

  it('shows an empty state for a new client', () => {
    mockConnections({ data: [] });
    renderWithProviders(<ConnectionsPage />);

    expect(screen.getByText('Você ainda não tem conexões.')).toBeInTheDocument();
  });

  it('shows a loader while the listener connects and an error when it fails', () => {
    mockConnections({ status: 'loading' });
    const { unmount } = renderWithProviders(<ConnectionsPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    unmount();

    mockConnections({ status: 'error' });
    renderWithProviders(<ConnectionsPage />);
    expect(screen.getByText(/Não foi possível carregar/)).toBeInTheDocument();
  });

  it('deletes a connection after confirmation', async () => {
    mockConnections({ data: CONNECTIONS });
    renderWithProviders(<ConnectionsPage />);

    await userEvent.click(screen.getByRole('button', { name: 'Excluir: Suporte' }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/contatos e mensagens desta conexão/)).toBeInTheDocument();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Excluir' }));

    await waitFor(() => expect(deleteConnection).toHaveBeenCalledWith('conn-2'));
    expect(await screen.findByText('Conexão excluída.')).toBeInTheDocument();
  });

  it('reports a failed deletion', async () => {
    vi.mocked(deleteConnection).mockRejectedValueOnce(new Error('permission-denied'));
    mockConnections({ data: CONNECTIONS });
    renderWithProviders(<ConnectionsPage />);

    await userEvent.click(screen.getByRole('button', { name: 'Excluir: Vendas' }));
    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Excluir' }));

    expect(await screen.findByText(/Não foi possível excluir/)).toBeInTheDocument();
  });

  it('opens the editor prefilled with the connection name', async () => {
    mockConnections({ data: CONNECTIONS });
    renderWithProviders(<ConnectionsPage />);

    await userEvent.click(screen.getByRole('button', { name: 'Editar: Vendas' }));

    expect(screen.getByLabelText('Nome da conexão')).toHaveValue('Vendas');
  });
});
