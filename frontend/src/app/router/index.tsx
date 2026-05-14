import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { AuthLayout } from '@/widgets/layouts/AuthLayout';
import { DashboardLayout } from '@/widgets/layouts/DashboardLayout';
import { PrivateRoute } from '@/shared/ui/PrivateRoute';
import { ConnectionsPage } from '@/pages/connections/ConnectionsPage';
import { ContactsPage } from '@/pages/contacts/ContactsPage';
import { MessagesPage } from '@/pages/messages/MessagesPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/connections" replace />,
  },
  {
    element: <AuthLayout />,
    children: [
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
]);
