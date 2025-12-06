import { createReducer } from '@reduxjs/toolkit';
import { Offer } from '../../../types';
import {
  loadFavoritesRequest,
  loadFavoritesSuccess,
  loadFavoritesError,
} from '../../actions';

export interface FavoritesState {
  favorites: Offer[];
  isLoading: boolean;
  isError: boolean;
}

const initialState: FavoritesState = {
  favorites: [],
  isLoading: false,
  isError: false,
};

export const favoritesReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loadFavoritesRequest, (state) => {
      state.isLoading = true;
      state.isError = false;
    })
    .addCase(loadFavoritesSuccess, (state, action) => {
      state.isLoading = false;
      state.favorites = action.payload;
    })
    .addCase(loadFavoritesError, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
});
