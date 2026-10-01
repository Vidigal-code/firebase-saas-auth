import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { deleteContact } from '@/entities/contact/api/contactsRepository';
import { useContacts } from '@/entities/contact/model/useContacts';
import { renderWithProviders, TEST_USER } from '@/test/renderWithProviders';
import { ContactsPage } from './ContactsPage';

const SCOPE = { clientId: TEST_USER.uid, connectionId: 'conn-1' };
const PHONE = '+5511988887777';
const CONNECTION = { id: SCOPE.connectionId, name: 'Vendas', createdAt: new Date() };

vi.mock('@/entities/contact/api/contactsRepository', () => ({
  createContact: vi.fn(() => Promise.resolve()),
  updateContact: vi.fn(() => Promise.resolve()),
  deleteContact: vi.fn(() => Promise.resolve()),
}));
vi.mock('@/entities/contact/model/useContacts', () => ({ useContacts: vi.fn() }));
vi.mock('@/widgets/connection-shell/connectionContext', () => ({
  useConnectionContext: () => ({ connection: CONNECTION, scope: SCOPE }),
}));

describe('ContactsPage', () => {
  it('lists contacts of the current connection and deletes one', async () => {
    vi.mocked(useContacts).mockReturnValue({
      status: 'ready',
      error: null,
      data: [{ id: 'c1', connectionId: SCOPE.connectionId, name: 'Ana Souza', phone: PHONE }],
    });
    renderWithProviders(<ContactsPage />);

    expect(useContacts).toHaveBeenCalledWith(SCOPE);
    expect(screen.getByRole('link', { name: PHONE })).toHaveAttribute('href', `tel:${PHONE}`);

    await userEvent.click(screen.getByRole('button', { name: 'Excluir: Ana Souza' }));
    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Excluir' }));

    await waitFor(() => expect(deleteContact).toHaveBeenCalledWith('c1'));
  });

  it('opens the contact editor', async () => {
    vi.mocked(useContacts).mockReturnValue({ status: 'ready', error: null, data: [] });
    renderWithProviders(<ContactsPage />);

    expect(screen.getByText('Nenhum contato nesta conexão.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Novo contato' }));

    expect(screen.getByRole('dialog', { name: 'Novo contato' })).toBeInTheDocument();
  });
});
