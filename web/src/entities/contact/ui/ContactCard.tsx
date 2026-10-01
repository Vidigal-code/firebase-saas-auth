import PhoneOutlined from '@mui/icons-material/PhoneOutlined';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { EditDeleteActions } from '@/shared/ui/CardActions';
import type { Contact } from '../model/types';

const INITIALS_LENGTH = 2;

const toInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, INITIALS_LENGTH)
    .map((word) => word[0].toUpperCase())
    .join('');

export interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export const ContactCard = ({ contact, onEdit, onDelete }: Readonly<ContactCardProps>) => (
  <Card component="article" className="flex items-center gap-3 p-4">
    <Avatar className="brand-gradient text-sm font-bold text-white">{toInitials(contact.name)}</Avatar>
    <div className="min-w-0 flex-1">
      <Typography variant="subtitle1" component="h2" className="truncate font-semibold" title={contact.name}>
        {contact.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" className="flex items-center gap-1">
        <PhoneOutlined fontSize="inherit" aria-hidden />
        <a href={`tel:${contact.phone}`} className="text-inherit no-underline hover:underline">
          {contact.phone}
        </a>
      </Typography>
    </div>
    <EditDeleteActions itemLabel={contact.name} onEdit={() => onEdit(contact)} onDelete={() => onDelete(contact)} />
  </Card>
);
