import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { createConnection, updateConnection } from '@/entities/connection/api/connectionsRepository';
import { renderWithProviders, TEST_USER } from '@/test/renderWithProviders';
import { ConnectionFormDialog } from './ConnectionFormDialog';

vi.mock('@/entities/connection/api/connectionsRepository', () => ({
  createConnection: vi.fn(() => Promise.resolve()),
  updateConnection: vi.fn(() => Promise.resolve()),
}));

const EXISTING = { id: 'conn-1', name: 'Vendas', createdAt: new Date(2026, 9, 1) };

describe('ConnectionFormDialog', () => {
  it('creates a connection owned by the signed-in client', async () => {
    const onClose = vi.fn();
    renderWithProviders(<ConnectionFormDialog connection={null} onClose={onClose} />);

    await userEvent.type(screen.getByLabelText('Nome da conexão'), '  Suporte  ');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(createConnection).toHaveBeenCalledWith(TEST_USER.uid, { name: 'Suporte' });
    expect(await screen.findByText('Conexão criada.')).toBeInTheDocument();
  });

  it('renames an existing connection', async () => {
    renderWithProviders(<ConnectionFormDialog connection={EXISTING} onClose={vi.fn()} />);

    const input = screen.getByLabelText('Nome da conexão');
    await userEvent.clear(input);
    await userEvent.type(input, 'Vendas SP');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => expect(updateConnection).toHaveBeenCalledWith('conn-1', { name: 'Vendas SP' }));
  });

  it('blocks blank names', async () => {
    renderWithProviders(<ConnectionFormDialog connection={null} onClose={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByText('Campo obrigatório.')).toBeInTheDocument();
    expect(createConnection).not.toHaveBeenCalled();
  });

  it('keeps the dialog open and explains a failed save', async () => {
    vi.mocked(createConnection).mockRejectedValueOnce(new Error('permission-denied'));
    const onClose = vi.fn();
    renderWithProviders(<ConnectionFormDialog connection={null} onClose={onClose} />);

    await userEvent.type(screen.getByLabelText('Nome da conexão'), 'Vendas');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByText(/Não foi possível salvar/)).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });
});
