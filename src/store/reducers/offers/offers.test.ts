import { describe, test, expect } from 'vitest';
import { offersReducer } from './offers';
import {
  loadOffersRequest,
  loadOffersSuccess,
  loadOffersError,
  setOffers,
} from '../../actions';
import { makeFakeOffers } from '../../../utils/mocks';
import { AnyAction } from '@reduxjs/toolkit';

describe('offers reducer', () => {
  const initialState = {
    offers: [],
    isLoading: false,
    isError: false,
  };

  const mockOffers = makeFakeOffers(3);

  test('should return initial state', () => {
    expect(offersReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  test('should handle loadOffersRequest', () => {
    const action = loadOffersRequest();
    const state = offersReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.isError).toBe(false);
    expect(state.offers).toEqual([]);
  });

  test('should handle loadOffersSuccess', () => {
    const action = loadOffersSuccess(mockOffers);
    const state = offersReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.isError).toBe(false);
    expect(state.offers).toEqual(mockOffers);
    expect(state.offers).toHaveLength(3);
  });

  test('should handle loadOffersError', () => {
    const loadingState = {
      ...initialState,
      isLoading: true,
    };

    const action = loadOffersError();
    const state = offersReducer(loadingState, action);

    expect(state.isLoading).toBe(false);
    expect(state.isError).toBe(true);
    expect(state.offers).toEqual([]);
  });

  test('should handle setOffers', () => {
    const action = setOffers(mockOffers);
    const state = offersReducer(initialState, action);

    expect(state.offers).toEqual(mockOffers);
    expect(state.isLoading).toBe(false);
    expect(state.isError).toBe(false);
  });

  test('should update offers correctly', () => {
    const firstOffers = makeFakeOffers(2);
    const secondOffers = makeFakeOffers(4);

    let state = offersReducer(initialState, loadOffersSuccess(firstOffers));
    expect(state.offers).toHaveLength(2);

    state = offersReducer(state, loadOffersSuccess(secondOffers));
    expect(state.offers).toHaveLength(4);
  });

  test('should not modify state for unknown action', () => {
    const state = offersReducer(initialState, {
      type: 'UNKNOWN_ACTION',
    } as AnyAction);
    expect(state).toEqual(initialState);
  });
});
