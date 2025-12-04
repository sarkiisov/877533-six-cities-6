import { createAction } from '@reduxjs/toolkit';
import { City, Offer } from '../types';

export const actions = {
  setCity: createAction<City>('city/set'),
  setOffers: createAction<Offer[]>('offers/set'),
  loadOffersRequest: createAction('offers/loadRequest'),
  loadOffersSuccess: createAction<Offer[]>('offers/loadSuccess'),
  loadOffersError: createAction('offers/loadError'),
};

export type Actions = ReturnType<(typeof actions)[keyof typeof actions]>;
