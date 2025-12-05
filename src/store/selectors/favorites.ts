import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';

export const getFavorites = (state: RootState) => state.favorites.favorites;
export const getFavoritesLoadingStatus = (state: RootState) =>
  state.favorites.isLoading;
export const getFavoritesErrorStatus = (state: RootState) =>
  state.favorites.isError;

export const getFavoritesCount = createSelector(
  [getFavorites],
  (favorites) => favorites.length
);

export const getFavoritesData = createSelector(
  [getFavorites, getFavoritesLoadingStatus, getFavoritesErrorStatus],
  (favorites, isLoading, isError) => ({
    favorites,
    isLoading,
    isError,
  })
);
