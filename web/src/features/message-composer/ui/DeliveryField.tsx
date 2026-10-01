import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useId } from 'react';
import { DELIVERY_MODES, type DeliveryMode } from '@/entities/message/model/delivery';
import { useTranslation } from '@/shared/i18n/useTranslation';
import type { TranslationKey } from '@/shared/i18n/translate';
import { isOneOf } from '@/shared/lib/isOneOf';

const DELIVERY_LABELS: Record<DeliveryMode, TranslationKey> = {
  now: 'broadcast.deliveryNow',
  schedule: 'broadcast.deliverySchedule',
};

export interface DeliveryFieldProps {
  value: DeliveryMode;
  onChange: (delivery: DeliveryMode) => void;
}

export const DeliveryField = ({ value, onChange }: Readonly<DeliveryFieldProps>) => {
  const { t } = useTranslation();
  const labelId = useId();

  return (
    <FormControl>
      <FormLabel id={labelId}>{t('broadcast.deliveryLabel')}</FormLabel>
      <RadioGroup
        row
        aria-labelledby={labelId}
        value={value}
        onChange={(event) => isOneOf(DELIVERY_MODES, event.target.value) && onChange(event.target.value)}
      >
        {DELIVERY_MODES.map((mode) => (
          <FormControlLabel key={mode} value={mode} control={<Radio />} label={t(DELIVERY_LABELS[mode])} />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
