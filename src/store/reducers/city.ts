import { createReducer } from '@reduxjs/toolkit';
import { City } from '../../types';
import { setCity } from '../actions';
import { cities } from '../../utils/consts';

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
