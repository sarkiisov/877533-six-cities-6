import { createAction } from '@reduxjs/toolkit';
import {
  AuthInfo,
  AuthorizationStatus,
  City,
  Comment,
  Offer,
  OfferExtended,
} from '../types';

export const actions = {
  setCity: createAction<City>('city/set'),
  setOffers: createAction<Offer[]>('offers/set'),
  loadOffersRequest: createAction('offers/loadRequest'),
  loadOffersSuccess: createAction<Offer[]>('offers/loadSuccess'),
  loadOffersError: createAction('offers/loadError'),
  requireAuthorization: createAction<AuthorizationStatus>(
    'user/requireAuthorization'
  ),
  setAuthInfo: createAction<AuthInfo | null>('user/setAuthInfo'),
  loadOfferRequest: createAction('offer/loadOfferRequest'),
  loadOfferSuccess: createAction<OfferExtended>('offer/loadOfferSuccess'),
  loadOfferError: createAction('offer/loadOfferError'),
  loadNearbyOffersSuccess: createAction<Offer[]>(
    'offer/loadNearbyOffersSuccess'
  ),
  loadCommentsSuccess: createAction<Comment[]>('offer/loadCommentsSuccess'),
};

export type Actions = ReturnType<(typeof actions)[keyof typeof actions]>;
