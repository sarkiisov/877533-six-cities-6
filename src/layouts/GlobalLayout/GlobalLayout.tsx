import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { Dispatch } from '../../store';
import { useEffect } from 'react';
import { checkAuth, fetchFavorites } from '../../store/api-actions';
import { getAuthStatus } from '../../store/selectors';

export const GlobalLayout = () => {
  const dispatch = useDispatch<Dispatch>();

  const authStatus = useSelector(getAuthStatus);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (authStatus === 'AUTH') {
      dispatch(fetchFavorites());
    }
  }, [dispatch, authStatus]);

  return <Outlet />;
};
