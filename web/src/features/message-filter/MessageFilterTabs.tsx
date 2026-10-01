import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { MESSAGE_FILTERS, type MessageFilter } from '@/entities/message/model/filters';
import { useTranslation } from '@/shared/i18n/useTranslation';
import type { TranslationKey } from '@/shared/i18n/translate';

const FILTER_LABELS: Record<MessageFilter, TranslationKey> = {
  all: 'broadcast.filters.all',
  sent: 'broadcast.filters.sent',
  scheduled: 'broadcast.filters.scheduled',
};

export interface MessageFilterTabsProps {
  value: MessageFilter;
  counts: Record<MessageFilter, number>;
  onChange: (filter: MessageFilter) => void;
}

export const MessageFilterTabs = ({ value, counts, onChange }: Readonly<MessageFilterTabsProps>) => {
  const { t } = useTranslation();

  return (
    <Tabs
      value={value}
      onChange={(_, next: MessageFilter) => onChange(next)}
      aria-label={t('broadcast.filterLabel')}
      variant="scrollable"
      allowScrollButtonsMobile
      className="mb-4 border-b border-divider"
    >
      {MESSAGE_FILTERS.map((filter) => (
        <Tab key={filter} value={filter} label={`${t(FILTER_LABELS[filter])} (${counts[filter]})`} />
      ))}
    </Tabs>
  );
};
