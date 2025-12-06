import { AnyAction } from '@reduxjs/toolkit';
import { AuthInfo } from '../../../types';
import { requireAuth, setAuthInfo } from '../../actions';
import { authReducer } from './auth';

describe('auth reducer', () => {
  const initialState = {
    authStatus: 'UNKNOWN' as const,
    authInfo: null,
  };

  const mockAuthInfo: AuthInfo = {
    name: 'John Doe',
    avatarUrl: 'avatar.jpg',
    isPro: false,
    email: 'john@example.com',
    token: 'token123',
  };

  test('should return initial state', () => {
    expect(authReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  test('should handle requireAuth', () => {
    const action = requireAuth('AUTH');
    const state = authReducer(initialState, action);

    expect(state.authStatus).toBe('AUTH');
    expect(state.authInfo).toBeNull();
  });

  test('should handle setAuthInfo', () => {
    const action = setAuthInfo(mockAuthInfo);
    const state = authReducer(initialState, action);

    expect(state.authInfo).toEqual(mockAuthInfo);
    expect(state.authStatus).toBe('UNKNOWN');
  });

  test('should handle setAuthInfo with null', () => {
    const stateWithInfo = {
      authStatus: 'AUTH' as const,
      authInfo: mockAuthInfo,
    };

    const action = setAuthInfo(null);
    const state = authReducer(stateWithInfo, action);

    expect(state.authInfo).toBeNull();
    expect(state.authStatus).toBe('AUTH');
  });

  test('should handle multiple actions', () => {
    let state = authReducer(initialState, requireAuth('AUTH'));
    state = authReducer(state, setAuthInfo(mockAuthInfo));

    expect(state.authStatus).toBe('AUTH');
    expect(state.authInfo).toEqual(mockAuthInfo);
  });

  test('should not modify state for unknown action', () => {
    const state = authReducer(initialState, {
      type: 'UNKNOWN_ACTION',
    } as AnyAction);
    expect(state).toEqual(initialState);
  });
});
