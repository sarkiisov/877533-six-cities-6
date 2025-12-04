import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAuthStatus } from '../../store/selectors';

export const AuthLayout = () => {
  const authStatus = useSelector(getAuthStatus);

  const location = useLocation();

  const renderComponent = {
    UNKNOWN: null,
    AUTH: <Navigate to="/" replace state={{ from: location }} />,
    NO_AUTH: <Outlet />,
  }[authStatus];

  return renderComponent;
};
