import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ProtectedRoutesProps } from './ProtectedRoutes.types';

export const ProtectedRoutes = ({
  isLoading,
  isAuthenticated,
}: ProtectedRoutesProps) => {
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace state={{ from: location }} />;
};
