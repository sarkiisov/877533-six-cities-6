import { createReducer } from '@reduxjs/toolkit';
import { AuthInfo, AuthStatus } from '../../types';
import { requireAuth, setAuthInfo } from '../actions';

export interface AuthState {
  authStatus: AuthStatus;
  authInfo: AuthInfo | null;
}

const initialState: AuthState = {
  authStatus: 'UNKNOWN',
  authInfo: null,
};

export const authReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(requireAuth, (state, action) => {
      state.authStatus = action.payload;
    })
    .addCase(setAuthInfo, (state, action) => {
      state.authInfo = action.payload;
    });
});
