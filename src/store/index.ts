import { configureStore, ThunkDispatch } from '@reduxjs/toolkit';
import { rootReducer } from './reducers';
import { createAPI } from '../api/api';
import { AxiosInstance } from 'axios';
import { Actions } from './actions';

const api = createAPI();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: { extraArgument: api } }),
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = ThunkDispatch<RootState, AxiosInstance, Actions>;
export type Extra = typeof api;
