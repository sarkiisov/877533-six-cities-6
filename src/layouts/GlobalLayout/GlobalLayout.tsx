import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { Dispatch } from '../../store';
import { useEffect } from 'react';
import { checkAuth } from '../../store/api-action';

export const GlobalLayout = () => {
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return <Outlet />;
};
