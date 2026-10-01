import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import type { Contact } from '@/entities/contact/model/types';
import { useTranslation } from '@/shared/i18n/useTranslation';

export interface RecipientsFieldProps {
  contacts: Contact[];
  value: string[];
  errorText?: string;
  onChange: (contactIds: string[]) => void;
}

interface ContactOptionLabelProps {
  contact: Contact;
  isSelected: boolean;
}

const toContactIds = (contacts: readonly Contact[]) => contacts.map((contact) => contact.id);

const ContactOptionLabel = ({ contact, isSelected }: Readonly<ContactOptionLabelProps>) => (
  <>
    <Checkbox size="small" checked={isSelected} className="mr-2" />
    <span className="flex flex-col">
      <span>{contact.name}</span>
      <span className="text-xs text-text-secondary">{contact.phone}</span>
    </span>
  </>
);

export const RecipientsField = ({ contacts, value, errorText, onChange }: Readonly<RecipientsFieldProps>) => {
  const { t } = useTranslation();
  const selected = contacts.filter((contact) => value.includes(contact.id));
  const hasContacts = contacts.length > 0;
  const allSelected = hasContacts && selected.length === contacts.length;

  const toggleAll = () => onChange(allSelected ? [] : toContactIds(contacts));

  return (
    <div className="flex flex-col gap-1">
      <Autocomplete
        multiple
        disableCloseOnSelect
        options={contacts}
        value={selected}
        onChange={(_, next) => onChange(toContactIds(next))}
        getOptionLabel={(contact) => contact.name}
        isOptionEqualToValue={(option, current) => option.id === current.id}
        renderOption={({ key, ...optionProps }, contact, { selected: isSelected }) => (
          <li key={key} {...optionProps}>
            <ContactOptionLabel contact={contact} isSelected={isSelected} />
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t('broadcast.recipientsLabel')}
            placeholder={t('broadcast.recipientsPlaceholder')}
            error={Boolean(errorText)}
            helperText={errorText ?? t('broadcast.recipientsCount', { count: selected.length })}
          />
        )}
      />
      <Button size="small" onClick={toggleAll} disabled={!hasContacts} className="self-center sm:self-start">
        {allSelected ? t('broadcast.clearSelection') : t('broadcast.selectAll')}
      </Button>
    </div>
  );
};
