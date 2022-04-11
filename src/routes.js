import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
//
import NotFound from './pages/Page404';

// ----------------------------------------------------------------------
//
import App from './pages/dashboard/DashboardApp';
import MobileSubscribers from './pages/dashboard/DashboardMobileSubscribers';

//-----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard" replace />, index: true },
        { path: 'app', element: <App /> },
        { path: 'mobile-subscribers', element: <MobileSubscribers /> },
        { path: '404', element: <NotFound /> },
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}