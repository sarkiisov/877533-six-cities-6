import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { State } from './reducer';
import { actions, Actions } from './action';
import { AuthInfo, Offer } from '../types';
import { AxiosInstance } from 'axios';

export const fetchOffers =
  (): ThunkAction<Promise<void>, State, AxiosInstance, Actions> =>
    async (
      dispatch: ThunkDispatch<State, AxiosInstance, Actions>,
      _getState,
      api
    ) => {
      dispatch(actions.loadOffersRequest());
      try {
        const { data } = await api.get<Offer[]>('/offers');
        dispatch(actions.loadOffersSuccess(data));
      } catch {
        dispatch(actions.loadOffersError());
      }
    };

export const checkAuth =
  (): ThunkAction<Promise<void>, State, AxiosInstance, Actions> =>
    async (
      dispatch: ThunkDispatch<State, AxiosInstance, Actions>,
      _getState,
      api
    ) => {
      try {
        const { data } = await api.get<AuthInfo>('/login');

        dispatch(actions.requireAuthorization('AUTH'));
        dispatch(actions.setAuthInfo(data));
      } catch {
        dispatch(actions.requireAuthorization('NO_AUTH'));
        dispatch(actions.setAuthInfo(null));
      }
    };

export const login =
  (loginData: {
    email: string;
    password: string;
  }): ThunkAction<Promise<void>, State, AxiosInstance, Actions> =>
    async (dispatch, _getState, api) => {
      try {
        const { data } = await api.post<AuthInfo>('/login', loginData);

        localStorage.setItem('token', data.token);

        dispatch(actions.requireAuthorization('AUTH'));
        dispatch(actions.setAuthInfo(data));
      } catch (err) {
        dispatch(actions.requireAuthorization('NO_AUTH'));
        dispatch(actions.setAuthInfo(null));
        throw err;
      }
    };

export const logout =
  (): ThunkAction<Promise<void>, State, AxiosInstance, Actions> =>
    async (
      dispatch: ThunkDispatch<State, AxiosInstance, Actions>,
      _getState,
      api: AxiosInstance
    ) => {
      await api
        .delete('/logout')
        .finally(() => {})
        .finally(() => {
          localStorage.removeItem('token');

          dispatch(actions.requireAuthorization('NO_AUTH'));
          dispatch(actions.setAuthInfo(null));
        });
    };
