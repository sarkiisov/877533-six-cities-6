import { describe, test, expect } from 'vitest';
import { favoritesReducer } from './favorites';
import {
  loadFavoritesRequest,
  loadFavoritesSuccess,
  loadFavoritesError,
} from '../../actions';
import { makeFakeOffers } from '../../../utils/mocks';
import { AnyAction } from '@reduxjs/toolkit';

describe('favorites reducer', () => {
  const initialState = {
    favorites: [],
    isLoading: false,
    isError: false,
  };

  const mockFavorites = makeFakeOffers(3).map((offer) => ({
    ...offer,
    isFavorite: true,
  }));

  test('should return initial state', () => {
    expect(favoritesReducer(undefined, { type: '@@INIT' })).toEqual(
      initialState
    );
  });

  test('should handle loadFavoritesRequest', () => {
    const action = loadFavoritesRequest();
    const state = favoritesReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.isError).toBe(false);
    expect(state.favorites).toEqual([]);
  });

  test('should handle loadFavoritesSuccess', () => {
    const loadingState = {
      ...initialState,
      isLoading: true,
    };

    const action = loadFavoritesSuccess(mockFavorites);
    const state = favoritesReducer(loadingState, action);

    expect(state.isLoading).toBe(false);
    expect(state.isError).toBe(false);
    expect(state.favorites).toEqual(mockFavorites);
    expect(state.favorites).toHaveLength(3);
  });

  test('should handle loadFavoritesError', () => {
    const loadingState = {
      ...initialState,
      isLoading: true,
    };

    const action = loadFavoritesError();
    const state = favoritesReducer(loadingState, action);

    expect(state.isLoading).toBe(false);
    expect(state.isError).toBe(true);
    expect(state.favorites).toEqual([]);
  });

  test('should handle load empty favorites', () => {
    const action = loadFavoritesSuccess([]);
    const state = favoritesReducer(initialState, action);

    expect(state.favorites).toEqual([]);
    expect(state.favorites).toHaveLength(0);
  });

  test('should not modify state for unknown action', () => {
    const state = favoritesReducer(initialState, {
      type: 'UNKNOWN_ACTION',
    } as AnyAction);
    expect(state).toEqual(initialState);
  });
});
