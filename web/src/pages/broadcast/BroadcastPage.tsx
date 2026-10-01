import AddRounded from '@mui/icons-material/AddRounded';
import ForumOutlined from '@mui/icons-material/ForumOutlined';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { useContacts } from '@/entities/contact/model/useContacts';
import { deleteMessage } from '@/entities/message/api/messagesRepository';
import { countByFilter, filterMessages, type MessageFilter } from '@/entities/message/model/filters';
import type { Message } from '@/entities/message/model/types';
import { useMessages } from '@/entities/message/model/useMessages';
import { MessageCard } from '@/entities/message/ui/MessageCard';
import { ScheduledDispatchNotice } from '@/entities/message/ui/ScheduledDispatchNotice';
import { MessageFormDialog } from '@/features/message-composer/ui/MessageFormDialog';
import { MessageFilterTabs } from '@/features/message-filter/MessageFilterTabs';
import { buildContactsPath } from '@/shared/config/routes';
import { mergeStatuses } from '@/shared/firebase/useRealtimeQuery';
import { useEditorState } from '@/shared/hooks/useEditorState';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { EmptyState } from '@/shared/ui/EmptyState';
import { PageHeader } from '@/shared/ui/PageHeader';
import { PaginatedGrid } from '@/shared/ui/PaginatedGrid';
import { QueryBoundary } from '@/shared/ui/QueryBoundary';
import { useDeleteConfirmation } from '@/shared/ui/useDeleteConfirmation';
import { useConnectionContext } from '@/widgets/connection-shell/connectionContext';

export const BroadcastPage = () => {
  const { t } = useTranslation();
  const { connection, scope } = useConnectionContext();
  const contactsResult = useContacts(scope);
  const messagesResult = useMessages(scope);
  const [filter, setFilter] = useState<MessageFilter>('all');
  const editor = useEditorState<Message>();
  const deletion = useDeleteConfirmation<Message>({
    remove: (message) => deleteMessage(message.id),
    describe: () => ({ title: t('broadcast.deleteTitle'), message: t('broadcast.deleteMessage') }),
    successMessage: t('broadcast.deleted'),
  });

  const contacts = contactsResult.data;
  const messages = messagesResult.data;
  const contactNames = useMemo(() => new Map(contacts.map((contact) => [contact.id, contact.name])), [contacts]);
  const visibleMessages = useMemo(() => filterMessages(messages, filter), [messages, filter]);
  const counts = useMemo(() => countByFilter(messages), [messages]);
  const status = mergeStatuses([contactsResult.status, messagesResult.status]);
  const hasContacts = contacts.length > 0;

  return (
    <>
      <PageHeader
        headingLevel="h2"
        title={t('broadcast.title')}
        subtitle={t('broadcast.subtitle', { count: messages.length })}
        actions={
          <Button variant="contained" startIcon={<AddRounded />} onClick={editor.openCreate} disabled={!hasContacts}>
            {t('broadcast.new')}
          </Button>
        }
      />
      <QueryBoundary status={status}>
        {!hasContacts && (
          <Alert
            severity="info"
            className="mb-4"
            action={
              <Button component={Link} to={buildContactsPath(connection.id)} color="inherit" size="small">
                {t('broadcast.goToContacts')}
              </Button>
            }
          >
            {t('broadcast.noContacts')}
          </Alert>
        )}
        <ScheduledDispatchNotice className="mb-4" />
        <MessageFilterTabs value={filter} counts={counts} onChange={setFilter} />
        <PaginatedGrid
          key={filter}
          items={visibleMessages}
          getKey={(message) => message.id}
          renderItem={(message) => (
            <MessageCard
              message={message}
              contactNames={contactNames}
              onEdit={editor.openEdit}
              onDelete={deletion.request}
            />
          )}
          empty={
            <EmptyState
              icon={<ForumOutlined fontSize="inherit" />}
              title={t('broadcast.empty')}
              description={t('broadcast.emptyHint')}
            />
          }
        />
      </QueryBoundary>
      {editor.state.open && (
        <MessageFormDialog scope={scope} contacts={contacts} message={editor.state.target} onClose={editor.close} />
      )}
      <ConfirmDialog {...deletion.dialogProps} />
    </>
  );
};
