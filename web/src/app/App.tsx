import { RouterProvider } from 'react-router';
import { AppProviders } from './AppProviders';
import { router } from './router';

export const App = () => (
  <AppProviders>
    <RouterProvider router={router} />
  </AppProviders>
);
