import { useMemo } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { FiLink, FiUsers, FiMessageSquare } from 'react-icons/fi';
import {
  ActionButtonGroup,
  buildEditAction,
  buildDeleteAction,
  type ActionItem,
} from '@/shared/ui/ActionButtonGroup';
import { useLang } from '@/shared/hooks/useLang';
import { BRAND } from '@/shared/constants/theme';

const NAV_ICON_SIZE = 13;

interface Props {
  name: string;
  onEdit: () => void;
  onDelete: () => void;
  onContacts: () => void;
  onMessages: () => void;
}

const ConnectionCardHeader = ({ name, activeLabel }: { name: string; activeLabel: string }) => (
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
      <Chip label={activeLabel} color="success" size="small" sx={{ mt: 0.5 }} />
    </Box>
  </Box>
);

export const ConnectionCard = ({ name, onEdit, onDelete, onContacts, onMessages }: Props) => {
  const { t } = useLang();

  const allActions: ActionItem[] = useMemo(() => [
    { label: t.connections.contacts, icon: <FiUsers size={NAV_ICON_SIZE} />, variant: 'outlined', color: 'primary', onClick: onContacts },
    { label: t.connections.messages, icon: <FiMessageSquare size={NAV_ICON_SIZE} />, variant: 'outlined', color: 'secondary', onClick: onMessages },
    buildEditAction(onEdit, t.common.edit),
    buildDeleteAction(onDelete, t.common.delete),
  ], [t, onContacts, onMessages, onEdit, onDelete]);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <ConnectionCardHeader name={name} activeLabel={t.connections.active} />
        <ActionButtonGroup actions={allActions} columns={2} />
      </CardContent>
    </Card>
  );
};
