import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { EditDeleteActions } from '@/shared/ui/CardActions';
import type { Message } from '../model/types';
import { MessageStatusChip } from './MessageStatusChip';

const VISIBLE_RECIPIENTS = 3;
const PREVIEW_LENGTH = 40;

export interface MessageCardProps {
  message: Message;
  contactNames: ReadonlyMap<string, string>;
  onEdit: (message: Message) => void;
  onDelete: (message: Message) => void;
}

const DeliveryInfo = ({ message }: Readonly<{ message: Message }>) => {
  const { t, formatDateTime } = useTranslation();

  if (message.status === 'scheduled' && message.scheduledAt) {
    return <>{t('broadcast.scheduledFor', { date: formatDateTime(message.scheduledAt) })}</>;
  }
  if (message.sentAt) return <>{t('broadcast.sentAt', { date: formatDateTime(message.sentAt) })}</>;
  return null;
};

interface RecipientChipsProps extends Pick<MessageCardProps, 'contactNames'> {
  contactIds: string[];
}

const RecipientChips = ({ contactIds, contactNames }: Readonly<RecipientChipsProps>) => {
  const { t } = useTranslation();

  if (contactIds.length === 0) return <Chip size="small" label={t('broadcast.noRecipients')} />;

  const hiddenCount = contactIds.length - VISIBLE_RECIPIENTS;
  return (
    <>
      {contactIds.slice(0, VISIBLE_RECIPIENTS).map((id) => (
        <Chip key={id} size="small" label={contactNames.get(id) ?? t('broadcast.removedContact')} />
      ))}
      {hiddenCount > 0 && <Chip size="small" variant="outlined" label={`+${hiddenCount}`} />}
    </>
  );
};

export const MessageCard = ({ message, contactNames, onEdit, onDelete }: Readonly<MessageCardProps>) => (
  <Card component="article" className="flex h-full flex-col gap-3 p-4">
    <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col items-center gap-1 sm:items-start">
        <MessageStatusChip status={message.status} />
        <Typography variant="caption" color="text.secondary">
          <DeliveryInfo message={message} />
        </Typography>
      </div>
      <EditDeleteActions
        itemLabel={message.content.slice(0, PREVIEW_LENGTH)}
        onEdit={() => onEdit(message)}
        onDelete={() => onDelete(message)}
      />
    </div>
    <Typography variant="body2" className="line-clamp-4 whitespace-pre-line break-words text-center sm:text-left">
      {message.content}
    </Typography>
    <div className="mt-auto flex flex-wrap justify-center gap-1 sm:justify-start">
      <RecipientChips contactIds={message.contactIds} contactNames={contactNames} />
    </div>
  </Card>
);
