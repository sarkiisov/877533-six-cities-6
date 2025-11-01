import { createReducer } from '@reduxjs/toolkit';
import { setCity, setOffers } from './action';
import { City, Offer } from '../types';
import { cities, offers } from '../mocks';

export interface State {
  city: City;
  offers: Offer[];
}

const initialState: State = {
  city: cities[0],
  offers: offers,
};

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(setOffers, (state, action) => {
      state.offers = action.payload;
    });
});
