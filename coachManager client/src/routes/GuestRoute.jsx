import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { ROUTES } from '../utils/routes.js';

export function GuestRoute() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}
