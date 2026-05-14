import { useNavigate } from 'react-router-dom';
import { Drawer, IconButton, Button } from '@mui/material';
import { FiHome, FiUser, FiLogOut, FiX } from 'react-icons/fi';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  onOpenPasswordDialog: () => void;
}

export const MobileDrawer = ({ open, onClose, onLogout, onOpenPasswordDialog }: MobileDrawerProps) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handlePasswordClick = () => {
    onOpenPasswordDialog();
    onClose();
  };

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, backgroundColor: 'transparent' },
      }}
    >
      <div className="flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <span className="font-bold text-xl text-gray-900 dark:text-white flex items-center">
            <FiHome className="mr-2 text-primary" /> BroadcastApp
          </span>
          <IconButton onClick={onClose} className="md:hidden">
            <FiX className="dark:text-white" />
          </IconButton>
        </div>
        <div className="p-4 flex flex-col space-y-4 items-center mt-4">
          <Button 
            fullWidth 
            variant="outlined" 
            startIcon={<FiHome />} 
            onClick={() => handleNavigate('/connections')}
            className="dark:text-white dark:border-gray-600"
          >
            Início
          </Button>
          <Button 
            fullWidth 
            variant="outlined" 
            startIcon={<FiUser />} 
            onClick={handlePasswordClick}
            className="dark:text-white dark:border-gray-600"
          >
            Meu Perfil
          </Button>
          <Button 
            fullWidth 
            variant="outlined" 
            color="error" 
            startIcon={<FiLogOut />} 
            onClick={onLogout}
          >
            Sair
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
