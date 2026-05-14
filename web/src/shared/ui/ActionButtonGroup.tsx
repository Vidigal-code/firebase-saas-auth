import type { ReactNode } from 'react';
import { Box, Button, type SxProps, type Theme } from '@mui/material';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const ICON_SIZE = 14;

export interface ActionItem {
  label: string;
  icon: ReactNode;
  color?: 'primary' | 'secondary' | 'error' | 'inherit';
  variant?: 'outlined' | 'contained' | 'text';
  onClick: () => void;
}

interface Props {
  actions: ActionItem[];
  columns?: number;
  sx?: SxProps<Theme>;
}

export const ActionButtonGroup = ({ actions, columns = 2, sx }: Props) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: 1,
      width: '100%',
      ...sx,
    }}
  >
    {actions.map(({ label, icon, color = 'primary', variant = 'outlined', onClick }) => (
      <Button
        key={label}
        size="small"
        variant={variant}
        color={color}
        startIcon={icon}
        onClick={onClick}
        sx={{ minWidth: 0 }}
      >
        {label}
      </Button>
    ))}
  </Box>
);

export const buildEditAction = (onClick: () => void, label = 'Editar'): ActionItem => ({
  label,
  icon: <FiEdit2 size={ICON_SIZE} />,
  variant: 'outlined',
  color: 'primary',
  onClick,
});

export const buildDeleteAction = (onClick: () => void, label = 'Excluir'): ActionItem => ({
  label,
  icon: <FiTrash2 size={ICON_SIZE} />,
  variant: 'outlined',
  color: 'error',
  onClick,
});
