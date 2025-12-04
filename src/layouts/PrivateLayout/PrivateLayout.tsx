import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export const PrivateLayout = () => {
  const authorizationStatus = useSelector(
    (state: RootState) => state.authorizationStatus
  );

  const location = useLocation();

  const renderComponent = {
    UNKNOWN: null,
    AUTH: <Outlet />,
    NO_AUTH: <Navigate to="/login" replace state={{ from: location }} />,
  }[authorizationStatus];

  return renderComponent;
};
