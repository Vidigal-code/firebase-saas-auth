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

export const RecipientsField = ({ contacts, value, errorText, onChange }: Readonly<RecipientsFieldProps>) => {
  const { t } = useTranslation();
  const selected = contacts.filter((contact) => value.includes(contact.id));
  const allSelected = contacts.length > 0 && selected.length === contacts.length;

  const toggleAll = () => onChange(allSelected ? [] : contacts.map((contact) => contact.id));

  return (
    <div className="flex flex-col gap-1">
      <Autocomplete
        multiple
        disableCloseOnSelect
        options={contacts}
        value={selected}
        onChange={(_, next) => onChange(next.map((contact) => contact.id))}
        getOptionLabel={(contact) => contact.name}
        isOptionEqualToValue={(option, current) => option.id === current.id}
        renderOption={({ key, ...optionProps }, contact, { selected: isSelected }) => (
          <li key={key} {...optionProps}>
            <Checkbox size="small" checked={isSelected} className="mr-2" />
            <span className="flex flex-col">
              <span>{contact.name}</span>
              <span className="text-xs text-text-secondary">{contact.phone}</span>
            </span>
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
      <Button size="small" onClick={toggleAll} disabled={contacts.length === 0} className="self-start">
        {allSelected ? t('broadcast.clearSelection') : t('broadcast.selectAll')}
      </Button>
    </div>
  );
};
