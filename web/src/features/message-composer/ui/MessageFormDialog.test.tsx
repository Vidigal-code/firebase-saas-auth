import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { createMessage, updateMessage } from '@/entities/message/api/messagesRepository';
import type { Message } from '@/entities/message/model/types';
import { toDateTimeLocalValue } from '@/shared/lib/dateTimeLocal';
import { renderWithProviders } from '@/test/renderWithProviders';
import { MessageFormDialog } from './MessageFormDialog';

vi.mock('@/entities/message/api/messagesRepository', () => ({
  createMessage: vi.fn(() => Promise.resolve()),
  updateMessage: vi.fn(() => Promise.resolve()),
}));

const SCOPE = { clientId: 'client-a', connectionId: 'conn-1' };
const CONTACTS = [
  { id: 'c1', connectionId: 'conn-1', name: 'Ana', phone: '1133334444' },
  { id: 'c2', connectionId: 'conn-1', name: 'Bruno', phone: '1133335555' },
];
const HOUR_IN_MS = 3_600_000;

const SENT_MESSAGE: Message = {
  id: 'm1',
  connectionId: 'conn-1',
  contactIds: ['c1'],
  content: 'Promo',
  status: 'sent',
  scheduledAt: null,
  sentAt: new Date(2026, 9, 1),
  createdAt: new Date(2026, 9, 1),
};

const renderDialog = (message: Message | null = null) =>
  renderWithProviders(<MessageFormDialog scope={SCOPE} contacts={CONTACTS} message={message} onClose={vi.fn()} />);

const messageField = () => screen.getByRole('textbox', { name: 'Mensagem' });

describe('MessageFormDialog', () => {
  it('sends a message to every selected contact right away', async () => {
    renderDialog();

    await userEvent.click(screen.getByRole('button', { name: 'Selecionar todos' }));
    await userEvent.type(messageField(), 'Promo de hoje');
    await userEvent.click(screen.getByRole('button', { name: 'Enviar agora' }));

    await waitFor(() =>
      expect(createMessage).toHaveBeenCalledWith(SCOPE, {
        contactIds: ['c1', 'c2'],
        content: 'Promo de hoje',
        delivery: 'now',
        scheduledAt: null,
      }),
    );
    expect(await screen.findByText('Mensagem enviada.')).toBeInTheDocument();
  });

  it('requires at least one recipient', async () => {
    renderDialog();

    await userEvent.type(messageField(), 'Oi');
    await userEvent.click(screen.getByRole('button', { name: 'Enviar agora' }));

    expect(await screen.findByText('Selecione ao menos um contato.')).toBeInTheDocument();
    expect(createMessage).not.toHaveBeenCalled();
  });

  it('schedules a message for a future date', async () => {
    const future = new Date(Date.now() + HOUR_IN_MS);
    future.setSeconds(0, 0);
    renderDialog();

    await userEvent.click(screen.getByRole('button', { name: 'Selecionar todos' }));
    await userEvent.type(messageField(), 'Lembrete');
    await userEvent.click(screen.getByLabelText('Agendar'));
    const scheduleInput = screen.getByLabelText('Data e horário');
    await userEvent.clear(scheduleInput);
    await userEvent.type(scheduleInput, toDateTimeLocalValue(future));
    await userEvent.click(screen.getByRole('button', { name: 'Agendar' }));

    await waitFor(() =>
      expect(createMessage).toHaveBeenCalledWith(
        SCOPE,
        expect.objectContaining({ delivery: 'schedule', scheduledAt: future }),
      ),
    );
    expect(await screen.findByText('Mensagem agendada.')).toBeInTheDocument();
  });

  it('only lets the text and recipients of a sent message change', async () => {
    renderDialog(SENT_MESSAGE);

    expect(screen.getByText(/já foi enviada/)).toBeInTheDocument();
    expect(screen.queryByLabelText('Agendar')).not.toBeInTheDocument();

    await userEvent.type(messageField(), ' corrigida');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }));

    await waitFor(() =>
      expect(updateMessage).toHaveBeenCalledWith(SENT_MESSAGE, expect.objectContaining({ content: 'Promo corrigida' })),
    );
  });
});
