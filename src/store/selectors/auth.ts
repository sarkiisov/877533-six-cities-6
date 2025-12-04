import { RootState } from '..';

export const getAuthStatus = (state: RootState) => state.auth.authStatus;
export const getAuthInfo = (state: RootState) => state.auth.authInfo;
