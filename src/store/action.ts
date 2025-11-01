import { createAction } from '@reduxjs/toolkit';
import { City, Offer } from '../types';

export const setCity = createAction<City>('city/set');
export const setOffers = createAction<Offer[]>('offers/set');
