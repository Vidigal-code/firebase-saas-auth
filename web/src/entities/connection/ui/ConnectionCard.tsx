import { useMemo } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { FiLink, FiUsers, FiMessageSquare } from 'react-icons/fi';
import {
  ActionButtonGroup,
  buildEditAction,
  buildDeleteAction,
  type ActionItem,
} from '@/shared/ui/ActionButtonGroup';
import { BRAND } from '@/shared/constants/theme';

const NAV_ICON_SIZE = 13;

interface Props {
  name: string;
  onEdit: () => void;
  onDelete: () => void;
  onContacts: () => void;
  onMessages: () => void;
}

const buildContactsAction = (onClick: () => void): ActionItem => ({
  label: 'Contatos',
  icon: <FiUsers size={NAV_ICON_SIZE} />,
  variant: 'outlined',
  color: 'primary',
  onClick,
});

const buildMessagesAction = (onClick: () => void): ActionItem => ({
  label: 'Mensagens',
  icon: <FiMessageSquare size={NAV_ICON_SIZE} />,
  variant: 'outlined',
  color: 'secondary',
  onClick,
});

const ConnectionCardHeader = ({ name }: Pick<Props, 'name'>) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: '8px',
        background: BRAND.gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: 16,
        flexShrink: 0,
      }}
    >
      <FiLink />
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        variant="subtitle1"
        title={name}
        sx={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        {name}
      </Typography>
      <Chip label="Ativa" color="success" size="small" sx={{ mt: 0.5 }} />
    </Box>
  </Box>
);

export const ConnectionCard = ({ name, onEdit, onDelete, onContacts, onMessages }: Props) => {
  const allActions = useMemo(() => [
    buildContactsAction(onContacts),
    buildMessagesAction(onMessages),
    buildEditAction(onEdit),
    buildDeleteAction(onDelete),
  ], [onContacts, onMessages, onEdit, onDelete]);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <ConnectionCardHeader name={name} />
        <ActionButtonGroup actions={allActions} columns={2} />
      </CardContent>
    </Card>
  );
};
