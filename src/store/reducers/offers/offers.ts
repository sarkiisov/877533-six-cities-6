import { createReducer } from '@reduxjs/toolkit';
import { Offer } from '../../../types';
import {
  loadOffersRequest,
  loadOffersSuccess,
  loadOffersError,
  setOffers,
} from '../../actions';

export interface OffersState {
  offers: Offer[];
  isLoading: boolean;
  isError: boolean;
}

const initialState: OffersState = {
  offers: [],
  isLoading: false,
  isError: false,
};

export const offersReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setOffers, (state, action) => {
      state.offers = action.payload;
    })
    .addCase(loadOffersRequest, (state) => {
      state.isLoading = true;
      state.isError = false;
    })
    .addCase(loadOffersSuccess, (state, action) => {
      state.isLoading = false;
      state.offers = action.payload;
    })
    .addCase(loadOffersError, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
});
