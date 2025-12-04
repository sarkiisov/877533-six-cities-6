import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { State } from './reducer';
import {
  actions,
  Actions,
} from './action';
import { Offer } from '../types';
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
