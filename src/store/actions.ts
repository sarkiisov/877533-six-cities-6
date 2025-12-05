import { createAction } from '@reduxjs/toolkit';
import {
  AuthInfo,
  AuthStatus,
  City,
  Comment,
  Offer,
  OfferExtended,
} from '../types';

export const setCity = createAction<City>('city/set');

export const setOffers = createAction<Offer[]>('offers/set');
export const loadOffersRequest = createAction('offers/loadRequest');
export const loadOffersSuccess = createAction<Offer[]>('offers/loadSuccess');
export const loadOffersError = createAction('offers/loadError');

export const loadFavoritesRequest = createAction('favorites/loadRequest');
export const loadFavoritesSuccess = createAction<Offer[]>(
  'favorites/loadSuccess'
);
export const loadFavoritesError = createAction('favorites/loadError');

export const loadOfferRequest = createAction('offer/loadOfferRequest');
export const loadOfferSuccess = createAction<OfferExtended>(
  'offer/loadOfferSuccess'
);
export const loadOfferError = createAction('offer/loadOfferError');
export const loadNearbyOffersSuccess = createAction<Offer[]>(
  'offer/loadNearbyOffersSuccess'
);
export const loadCommentsSuccess = createAction<Comment[]>(
  'offer/loadCommentsSuccess'
);

export const requireAuth = createAction<AuthStatus>('user/requireAuth');
export const setAuthInfo = createAction<AuthInfo | null>('user/setAuthInfo');

export const actions = {
  setCity,
  setOffers,
  loadOffersRequest,
  loadOffersSuccess,
  loadOffersError,
  loadFavoritesRequest,
  loadFavoritesSuccess,
  loadFavoritesError,
  requireAuth,
  setAuthInfo,
  loadOfferRequest,
  loadOfferSuccess,
  loadOfferError,
  loadNearbyOffersSuccess,
  loadCommentsSuccess,
};

export type Actions = ReturnType<(typeof actions)[keyof typeof actions]>;
