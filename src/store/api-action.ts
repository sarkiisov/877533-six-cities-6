/* eslint-disable no-empty */

import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { State } from './reducer';
import { actions, Actions } from './action';
import { AuthInfo, Comment, Offer, OfferExtended } from '../types';
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

export const fetchOffer =
  (id: string): ThunkAction<Promise<void>, State, AxiosInstance, Actions> =>
    async (
      dispatch: ThunkDispatch<State, AxiosInstance, Actions>,
      _getState,
      api
    ) => {
      dispatch(actions.loadOfferRequest());

      try {
        const { data: offer } = await api.get<OfferExtended>(`/offers/${id}`);
        dispatch(actions.loadOfferSuccess(offer));

        const { data: nearby } = await api.get<Offer[]>(`/offers/${id}/nearby`);
        dispatch(actions.loadNearbyOffersSuccess(nearby));

        const { data: comments } = await api.get<Comment[]>(`/comments/${id}`);
        dispatch(actions.loadCommentsSuccess(comments));
      } catch (err) {
        dispatch(actions.loadOfferError());
      }
    };

export const postComment =
  (
    offerId: string,
    comment: { comment: string; rating: number }
  ): ThunkAction<Promise<void>, State, AxiosInstance, Actions> =>
    async (dispatch, _getState, api) => {
      try {
        await api.post<Comment>(`/comments/${offerId}`, comment);
        const { data: comments } = await api.get<Comment[]>(
          `/comments/${offerId}`
        );
        dispatch(actions.loadCommentsSuccess(comments));
      } catch {}
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
      try {
        await api.delete('/logout');
      } catch {}
      localStorage.removeItem('token');

      dispatch(actions.requireAuthorization('NO_AUTH'));
      dispatch(actions.setAuthInfo(null));
    };
