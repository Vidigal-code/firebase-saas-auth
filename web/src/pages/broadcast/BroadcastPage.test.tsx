import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useContacts } from '@/entities/contact/model/useContacts';
import { deleteMessage } from '@/entities/message/api/messagesRepository';
import type { Message } from '@/entities/message/model/types';
import { useMessages } from '@/entities/message/model/useMessages';
import { renderWithProviders, TEST_USER } from '@/test/renderWithProviders';
import { BroadcastPage } from './BroadcastPage';

const SCOPE = { clientId: TEST_USER.uid, connectionId: 'conn-1' };
const CONNECTION = { id: SCOPE.connectionId, name: 'Vendas', createdAt: new Date() };

vi.mock('@/entities/message/api/messagesRepository', () => ({
  createMessage: vi.fn(() => Promise.resolve()),
  updateMessage: vi.fn(() => Promise.resolve()),
  deleteMessage: vi.fn(() => Promise.resolve()),
}));
vi.mock('@/entities/contact/model/useContacts', () => ({ useContacts: vi.fn() }));
vi.mock('@/entities/message/model/useMessages', () => ({ useMessages: vi.fn() }));
vi.mock('@/widgets/connection-shell/connectionContext', () => ({
  useConnectionContext: () => ({ connection: CONNECTION, scope: SCOPE }),
}));

const CONTACTS = [{ id: 'c1', connectionId: SCOPE.connectionId, name: 'Ana Souza', phone: '1133334444' }];

const buildMessage = (overrides: Partial<Message>): Message => ({
  id: 'm',
  connectionId: SCOPE.connectionId,
  contactIds: ['c1'],
  content: '',
  status: 'sent',
  scheduledAt: null,
  sentAt: new Date(2026, 9, 1, 9, 0),
  createdAt: new Date(2026, 9, 1),
  ...overrides,
});

const MESSAGES = [
  buildMessage({ id: 'm1', content: 'Promo enviada' }),
  buildMessage({
    id: 'm2',
    content: 'Lembrete agendado',
    status: 'scheduled',
    scheduledAt: new Date(2026, 9, 2, 8, 30),
    sentAt: null,
    contactIds: ['c1', 'gone'],
  }),
];

const mockData = (contacts = CONTACTS, messages = MESSAGES) => {
  vi.mocked(useContacts).mockReturnValue({ status: 'ready', error: null, data: contacts });
  vi.mocked(useMessages).mockReturnValue({ status: 'ready', error: null, data: messages });
};

describe('BroadcastPage', () => {
  beforeEach(() => mockData());

  it('shows message status, delivery time and recipients', () => {
    renderWithProviders(<BroadcastPage />);

    const scheduledCard = screen.getByText('Lembrete agendado').closest('article') as HTMLElement;
    expect(within(scheduledCard).getByText('Agendada')).toBeInTheDocument();
    expect(within(scheduledCard).getByText(/Agendada para/)).toBeInTheDocument();
    expect(within(scheduledCard).getByText('Ana Souza')).toBeInTheDocument();
    expect(within(scheduledCard).getByText('Contato removido')).toBeInTheDocument();
  });

  it('filters between sent and scheduled messages', async () => {
    renderWithProviders(<BroadcastPage />);

    await userEvent.click(screen.getByRole('tab', { name: 'Agendadas (1)' }));
    expect(screen.queryByText('Promo enviada')).not.toBeInTheDocument();
    expect(screen.getByText('Lembrete agendado')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('tab', { name: 'Enviadas (1)' }));
    expect(screen.getByText('Promo enviada')).toBeInTheDocument();
    expect(screen.queryByText('Lembrete agendado')).not.toBeInTheDocument();
  });

  it('opens the editor for a message and deletes another', async () => {
    renderWithProviders(<BroadcastPage />);

    await userEvent.click(screen.getByRole('button', { name: /^Editar: Lembrete/ }));
    expect(screen.getByRole('dialog', { name: 'Editar mensagem' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    await userEvent.click(screen.getByRole('button', { name: /^Excluir: Promo/ }));
    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Excluir' }));
    await waitFor(() => expect(deleteMessage).toHaveBeenCalledWith('m1'));
  });

  it('asks for contacts before composing when the connection has none', () => {
    mockData([], []);
    renderWithProviders(<BroadcastPage />);

    expect(screen.getByText(/Cadastre contatos nesta conexão/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nova mensagem' })).toBeDisabled();
    expect(screen.getByRole('link', { name: 'Ir para contatos' })).toHaveAttribute(
      'href',
      `/connections/${SCOPE.connectionId}/contacts`,
    );
  });
});
