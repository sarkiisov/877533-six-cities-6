import { createReducer } from '@reduxjs/toolkit';
import { City } from '../../types';
import { cities } from '../../mocks';
import { setCity } from '../actions';

export interface CityState {
  city: City;
}

const initialState: CityState = {
  city: cities[0],
};

export const cityReducer = createReducer(initialState, (builder) => {
  builder.addCase(setCity, (state, action) => {
    state.city = action.payload;
  });
});
