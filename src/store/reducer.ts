import { createReducer } from '@reduxjs/toolkit';
import { actions } from './action';
import { AuthInfo, AuthorizationStatus, City, Offer } from '../types';
import { cities } from '../mocks';

export interface State {
  city: City;
  offers: Offer[];
  isLoading: boolean;
  isError: boolean;
  authorizationStatus: AuthorizationStatus;
  authInfo: AuthInfo | null;
}

const initialState: State = {
  city: cities[0],
  offers: [],
  isLoading: false,
  isError: false,
  authorizationStatus: 'UNKNOWN',
  authInfo: null,
};

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(actions.setCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(actions.setOffers, (state, action) => {
      state.offers = action.payload;
    })
    .addCase(actions.loadOffersRequest, (state) => {
      state.isLoading = true;
      state.isError = false;
    })
    .addCase(actions.loadOffersSuccess, (state, action) => {
      state.isLoading = false;
      state.offers = action.payload;
    })
    .addCase(actions.loadOffersError, (state) => {
      state.isLoading = false;
      state.isError = true;
    })
    .addCase(actions.requireAuthorization, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(actions.setAuthInfo, (state, action) => {
      state.authInfo = action.payload;
    });
});
