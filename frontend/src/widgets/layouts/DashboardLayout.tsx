import { Outlet, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/shared/hooks/redux';
import { signOut } from 'firebase/auth';
import { auth } from '@/shared/config/firebase';
import { LogOut, Home } from 'lucide-react';
import { Button } from '@mui/material';

export const DashboardLayout = () => {
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/connections')}>
              <Home className="h-6 w-6 text-primary mr-2" />
              <span className="font-bold text-xl text-gray-900">BroadcastApp</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{user?.email}</span>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                onClick={handleLogout}
                startIcon={<LogOut className="h-4 w-4" />}
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
