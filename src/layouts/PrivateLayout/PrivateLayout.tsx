import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAuthStatus } from '../../store/selectors';

export const PrivateLayout = () => {
  const authStatus = useSelector(getAuthStatus);

  const location = useLocation();

  const renderComponent = {
    UNKNOWN: null,
    AUTH: <Outlet />,
    NO_AUTH: <Navigate to="/login" replace state={{ from: location }} />,
  }[authStatus];

  return renderComponent;
};
