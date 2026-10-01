import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import type { ReactNode } from 'react';
import { useTranslation } from '@/shared/i18n/useTranslation';

export interface EditDeleteActionsProps {
  itemLabel: string;
  onEdit: () => void;
  onDelete: () => void;
}

interface ItemActionButtonProps {
  title: string;
  itemLabel: string;
  icon: ReactNode;
  onClick: () => void;
  color?: IconButtonProps['color'];
}

const ItemActionButton = ({ title, itemLabel, icon, onClick, color }: Readonly<ItemActionButtonProps>) => (
  <Tooltip title={title}>
    <IconButton aria-label={`${title}: ${itemLabel}`} onClick={onClick} size="small" color={color}>
      {icon}
    </IconButton>
  </Tooltip>
);

export const EditDeleteActions = ({ itemLabel, onEdit, onDelete }: Readonly<EditDeleteActionsProps>) => {
  const { t } = useTranslation();

  return (
    <div className="flex shrink-0 gap-1">
      <ItemActionButton
        title={t('common.edit')}
        itemLabel={itemLabel}
        icon={<EditOutlined fontSize="small" />}
        onClick={onEdit}
      />
      <ItemActionButton
        title={t('common.delete')}
        itemLabel={itemLabel}
        icon={<DeleteOutlined fontSize="small" />}
        onClick={onDelete}
        color="error"
      />
    </div>
  );
};
