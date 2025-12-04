import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export const AuthLayout = () => {
  const authorizationStatus = useSelector(
    (state: RootState) => state.authorizationStatus
  );

  const location = useLocation();

  const renderComponent = {
    UNKNOWN: null,
    AUTH: <Navigate to="/" replace state={{ from: location }} />,
    NO_AUTH: <Outlet />,
  }[authorizationStatus];

  return renderComponent;
};
