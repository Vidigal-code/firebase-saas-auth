import PhoneOutlined from '@mui/icons-material/PhoneOutlined';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { EditDeleteActions } from '@/shared/ui/CardActions';
import type { Contact } from '../model/types';

const INITIALS_LENGTH = 2;
const WORD_SEPARATOR = /\s+/;

const toInitials = (name: string) =>
  name
    .split(WORD_SEPARATOR)
    .filter(Boolean)
    .slice(0, INITIALS_LENGTH)
    .map((word) => word[0].toUpperCase())
    .join('');

export interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

const ContactPhone = ({ phone }: Readonly<{ phone: string }>) => (
  <Typography variant="body2" color="text.secondary" className="flex items-center justify-center gap-1 sm:justify-start">
    <PhoneOutlined fontSize="inherit" aria-hidden />
    <a href={`tel:${phone}`} className="text-inherit no-underline hover:underline">
      {phone}
    </a>
  </Typography>
);

export const ContactCard = ({ contact, onEdit, onDelete }: Readonly<ContactCardProps>) => (
  <Card component="article" className="flex flex-col items-center gap-3 p-4 text-center sm:flex-row sm:text-left">
    <Avatar className="brand-gradient text-sm font-bold text-white">{toInitials(contact.name)}</Avatar>
    <div className="w-full min-w-0 flex-1">
      <Typography variant="subtitle1" component="h2" className="truncate font-semibold" title={contact.name}>
        {contact.name}
      </Typography>
      <ContactPhone phone={contact.phone} />
    </div>
    <EditDeleteActions itemLabel={contact.name} onEdit={() => onEdit(contact)} onDelete={() => onDelete(contact)} />
  </Card>
);
