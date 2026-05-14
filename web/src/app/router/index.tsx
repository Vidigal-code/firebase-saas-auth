import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { HomePage } from '@/pages/home/HomePage';
import { NotFoundPage } from '@/pages/notfound/NotFoundPage';
import { PublicLayout } from '@/widgets/layouts/PublicLayout';
import { DashboardLayout } from '@/widgets/layouts/DashboardLayout';
import { PrivateRoute } from '@/shared/ui/PrivateRoute';
import { GuestRoute } from '@/shared/ui/GuestRoute';
import { ConnectionsPage } from '@/pages/connections/ConnectionsPage';
import { ContactsPage } from '@/pages/contacts/ContactsPage';
import { MessagesPage } from '@/pages/messages/MessagesPage';

export const router = createBrowserRouter([
  {
    element: (
      <GuestRoute>
        <PublicLayout />
      </GuestRoute>
    ),
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { path: '/connections', element: <ConnectionsPage /> },
      { path: '/connections/:connectionId/contacts', element: <ContactsPage /> },
      { path: '/connections/:connectionId/messages', element: <MessagesPage /> },
    ],
  },
  {
    path: '*',
    element: <PublicLayout hideAuthButtons />,
    children: [
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
