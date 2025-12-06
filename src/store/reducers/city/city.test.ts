import { describe, test, expect } from 'vitest';
import { cityReducer } from './city';
import { setCity } from '../../actions';
import { AnyAction } from '@reduxjs/toolkit';
import { makeFakeCity } from '../../../utils/mocks';
import { CITIES } from '../../../utils/consts';

describe('city reducer', () => {
  const initialState = {
    city: CITIES[0],
  };

  test('should return initial state', () => {
    expect(cityReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  test('should handle setCity', () => {
    const newCity = makeFakeCity();
    const action = setCity(newCity);
    const state = cityReducer(initialState, action);

    expect(state.city).toEqual(newCity);
    expect(state.city.name).toBe(newCity.name);
  });

  test('should handle setCity with different city', () => {
    const newCity = {
      name: 'New City',
      location: {
        latitude: 50.0,
        longitude: 10.0,
        zoom: 12,
      },
    };

    const action = setCity(newCity);
    const state = cityReducer(initialState, action);

    expect(state.city.name).toBe('New City');
    expect(state.city.location.latitude).toBe(50.0);
  });

  test('should not modify state for unknown action', () => {
    const state = cityReducer(initialState, {
      type: 'UNKNOWN_ACTION',
    } as AnyAction);
    expect(state).toEqual(initialState);
  });
});
