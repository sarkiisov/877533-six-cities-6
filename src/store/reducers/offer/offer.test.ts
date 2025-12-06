import { describe, test, expect } from 'vitest';
import { offerReducer } from './offer';
import {
  loadOfferRequest,
  loadOfferSuccess,
  loadOfferError,
  loadNearbyOffersSuccess,
  loadCommentsSuccess,
} from '../../actions';
import {
  makeFakeExtendedOffer,
  makeFakeOffers,
  makeFakeComments,
} from '../../../utils/mocks';
import { AnyAction } from '@reduxjs/toolkit';

describe('offer reducer', () => {
  const initialState = {
    offer: null,
    nearbyOffers: [],
    comments: [],
    isLoading: false,
    isError: false,
  };

  const mockOffer = makeFakeExtendedOffer();
  const mockNearbyOffers = makeFakeOffers(3);
  const mockComments = makeFakeComments(2);

  test('should return initial state', () => {
    expect(offerReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  test('should handle loadOfferRequest', () => {
    const stateWithData = {
      ...initialState,
      offer: mockOffer,
      nearbyOffers: mockNearbyOffers,
      comments: mockComments,
    };

    const action = loadOfferRequest();
    const state = offerReducer(stateWithData, action);

    expect(state.isLoading).toBe(true);
    expect(state.isError).toBe(false);
    expect(state.offer).toBeNull();
    expect(state.nearbyOffers).toEqual([]);
    expect(state.comments).toEqual([]);
  });

  test('should handle loadOfferSuccess', () => {
    const loadingState = {
      ...initialState,
      isLoading: true,
    };

    const action = loadOfferSuccess(mockOffer);
    const state = offerReducer(loadingState, action);

    expect(state.isLoading).toBe(false);
    expect(state.isError).toBe(false);
    expect(state.offer).toEqual(mockOffer);
    expect(state.nearbyOffers).toEqual([]);
    expect(state.comments).toEqual([]);
  });

  test('should handle loadOfferError', () => {
    const loadingState = {
      ...initialState,
      isLoading: true,
    };

    const action = loadOfferError();
    const state = offerReducer(loadingState, action);

    expect(state.isLoading).toBe(false);
    expect(state.isError).toBe(true);
    expect(state.offer).toBeNull();
  });

  test('should handle loadNearbyOffersSuccess', () => {
    const action = loadNearbyOffersSuccess(mockNearbyOffers);
    const state = offerReducer(initialState, action);

    expect(state.nearbyOffers).toEqual(mockNearbyOffers);
    expect(state.nearbyOffers).toHaveLength(3);
    expect(state.offer).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  test('should handle loadCommentsSuccess', () => {
    const action = loadCommentsSuccess(mockComments);
    const state = offerReducer(initialState, action);

    expect(state.comments).toEqual(mockComments);
    expect(state.comments).toHaveLength(2);
    expect(state.offer).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  test('should handle complete offer loading flow', () => {
    let state = offerReducer(initialState, loadOfferRequest());
    expect(state.isLoading).toBe(true);
    expect(state.offer).toBeNull();

    state = offerReducer(state, loadOfferSuccess(mockOffer));
    expect(state.isLoading).toBe(false);
    expect(state.offer).toEqual(mockOffer);

    state = offerReducer(state, loadNearbyOffersSuccess(mockNearbyOffers));
    expect(state.nearbyOffers).toEqual(mockNearbyOffers);

    state = offerReducer(state, loadCommentsSuccess(mockComments));
    expect(state.comments).toEqual(mockComments);
  });

  test('should not modify state for unknown action', () => {
    const state = offerReducer(initialState, {
      type: 'UNKNOWN_ACTION',
    } as AnyAction);
    expect(state).toEqual(initialState);
  });
});
