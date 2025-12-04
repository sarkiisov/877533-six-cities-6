import { configureStore, ThunkDispatch } from '@reduxjs/toolkit';
import { reducer } from './reducer';
import { createAPI } from '../api/api';
import { AxiosInstance } from 'axios';
import { Actions } from './action';

const api = createAPI();

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: { extraArgument: api } }),
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = ThunkDispatch<RootState, AxiosInstance, Actions>;
export type Extra = typeof api;
