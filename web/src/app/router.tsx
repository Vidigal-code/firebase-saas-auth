import { createBrowserRouter, Navigate } from 'react-router';
import { RequireAuth, RequireGuest } from '@/entities/session/RouteGuards';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { BroadcastPage } from '@/pages/broadcast/BroadcastPage';
import { ConnectionsPage } from '@/pages/connections/ConnectionsPage';
import { ContactsPage } from '@/pages/contacts/ContactsPage';
import { HomePage } from '@/pages/home/HomePage';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';
import { CONNECTION_SEGMENTS, ROUTES } from '@/shared/config/routes';
import { DashboardLayout } from '@/widgets/app-shell/DashboardLayout';
import { PublicLayout } from '@/widgets/app-shell/PublicLayout';
import { ConnectionLayout } from '@/widgets/connection-shell/ConnectionLayout';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        element: <RequireGuest />,
        children: [
          { path: ROUTES.home, element: <HomePage /> },
          { path: ROUTES.login, element: <LoginPage /> },
          { path: ROUTES.register, element: <RegisterPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: ROUTES.connections, element: <ConnectionsPage /> },
          {
            path: ROUTES.connection,
            element: <ConnectionLayout />,
            children: [
              { index: true, element: <Navigate to={CONNECTION_SEGMENTS.contacts} replace /> },
              { path: CONNECTION_SEGMENTS.contacts, element: <ContactsPage /> },
              { path: CONNECTION_SEGMENTS.broadcast, element: <BroadcastPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
