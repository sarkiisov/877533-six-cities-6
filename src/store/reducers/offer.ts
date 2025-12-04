import { createReducer } from '@reduxjs/toolkit';
import { Offer, OfferExtended, Comment } from '../../types';
import {
  loadOfferRequest,
  loadOfferSuccess,
  loadOfferError,
  loadNearbyOffersSuccess,
  loadCommentsSuccess,
} from '../actions';

export interface OfferState {
  offer: OfferExtended | null;
  nearbyOffers: Offer[];
  comments: Comment[];
  isLoading: boolean;
  isError: boolean;
}

const initialState: OfferState = {
  offer: null,
  nearbyOffers: [],
  comments: [],
  isLoading: false,
  isError: false,
};

export const offerReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loadOfferRequest, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.offer = null;
      state.nearbyOffers = [];
      state.comments = [];
    })
    .addCase(loadOfferSuccess, (state, action) => {
      state.isLoading = false;
      state.offer = action.payload;
    })
    .addCase(loadOfferError, (state) => {
      state.isLoading = false;
      state.isError = true;
    })
    .addCase(loadNearbyOffersSuccess, (state, action) => {
      state.nearbyOffers = action.payload;
    })
    .addCase(loadCommentsSuccess, (state, action) => {
      state.comments = action.payload;
    });
});
