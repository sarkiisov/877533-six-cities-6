import { combineReducers } from '@reduxjs/toolkit';
import { cityReducer } from './city';
import { offersReducer } from './offers';
import { offerReducer } from './offer';
import { authReducer } from './auth';
import { favoritesReducer } from './favorites';

export const rootReducer = combineReducers({
  city: cityReducer,
  offers: offersReducer,
  offer: offerReducer,
  auth: authReducer,
  favorites: favoritesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
