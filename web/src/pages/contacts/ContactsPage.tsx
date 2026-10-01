import AddRounded from '@mui/icons-material/AddRounded';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import Button from '@mui/material/Button';
import { deleteContact } from '@/entities/contact/api/contactsRepository';
import type { Contact } from '@/entities/contact/model/types';
import { useContacts } from '@/entities/contact/model/useContacts';
import { ContactCard } from '@/entities/contact/ui/ContactCard';
import { ContactFormDialog } from '@/features/contact-editor/ContactFormDialog';
import { useEditorState } from '@/shared/hooks/useEditorState';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { EmptyState } from '@/shared/ui/EmptyState';
import { PageHeader } from '@/shared/ui/PageHeader';
import { PaginatedGrid } from '@/shared/ui/PaginatedGrid';
import { QueryBoundary } from '@/shared/ui/QueryBoundary';
import { useDeleteConfirmation } from '@/shared/ui/useDeleteConfirmation';
import { useConnectionContext } from '@/widgets/connection-shell/connectionContext';

export const ContactsPage = () => {
  const { t } = useTranslation();
  const { scope } = useConnectionContext();
  const { status, data: contacts } = useContacts(scope);
  const editor = useEditorState<Contact>();
  const deletion = useDeleteConfirmation<Contact>({
    remove: (contact) => deleteContact(contact.id),
    describe: (contact) => ({
      title: t('contacts.deleteTitle'),
      message: t('contacts.deleteMessage', { name: contact.name }),
    }),
    successMessage: t('contacts.deleted'),
  });

  return (
    <>
      <PageHeader
        headingLevel="h2"
        title={t('contacts.title')}
        subtitle={t('contacts.subtitle', { count: contacts.length })}
        actions={
          <Button variant="contained" startIcon={<AddRounded />} onClick={editor.openCreate}>
            {t('contacts.new')}
          </Button>
        }
      />
      <QueryBoundary status={status}>
        <PaginatedGrid
          items={contacts}
          getKey={(contact) => contact.id}
          renderItem={(contact) => (
            <ContactCard contact={contact} onEdit={editor.openEdit} onDelete={deletion.request} />
          )}
          empty={
            <EmptyState
              icon={<PeopleOutlined fontSize="inherit" />}
              title={t('contacts.empty')}
              description={t('contacts.emptyHint')}
            />
          }
        />
      </QueryBoundary>
      {editor.state.open && (
        <ContactFormDialog scope={scope} contact={editor.state.target} onClose={editor.close} />
      )}
      <ConfirmDialog {...deletion.dialogProps} />
    </>
  );
};
