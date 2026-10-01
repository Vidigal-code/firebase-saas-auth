import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { createContact, updateContact } from '@/entities/contact/api/contactsRepository';
import { renderWithProviders } from '@/test/renderWithProviders';
import { ContactFormDialog } from './ContactFormDialog';

vi.mock('@/entities/contact/api/contactsRepository', () => ({
  createContact: vi.fn(() => Promise.resolve()),
  updateContact: vi.fn(() => Promise.resolve()),
}));

const SCOPE = { clientId: 'client-a', connectionId: 'conn-1' };

describe('ContactFormDialog', () => {
  it('creates a contact in the connection with a normalized phone', async () => {
    renderWithProviders(<ContactFormDialog scope={SCOPE} contact={null} onClose={vi.fn()} />);

    await userEvent.type(screen.getByLabelText('Nome'), 'Ana Souza');
    await userEvent.type(screen.getByLabelText('Telefone'), '+55 (11) 98888-7777');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() =>
      expect(createContact).toHaveBeenCalledWith(SCOPE, { name: 'Ana Souza', phone: '+5511988887777' }),
    );
  });

  it('edits an existing contact', async () => {
    const contact = { id: 'contact-1', connectionId: 'conn-1', name: 'Ana', phone: '1133334444' };
    renderWithProviders(<ContactFormDialog scope={SCOPE} contact={contact} onClose={vi.fn()} />);

    await userEvent.type(screen.getByLabelText('Nome'), ' Paula');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() =>
      expect(updateContact).toHaveBeenCalledWith('contact-1', { name: 'Ana Paula', phone: '1133334444' }),
    );
  });

  it('rejects an invalid phone', async () => {
    renderWithProviders(<ContactFormDialog scope={SCOPE} contact={null} onClose={vi.fn()} />);

    await userEvent.type(screen.getByLabelText('Nome'), 'Ana');
    await userEvent.type(screen.getByLabelText('Telefone'), '123');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByText(/Informe um telefone válido/)).toBeInTheDocument();
    expect(createContact).not.toHaveBeenCalled();
  });
});
