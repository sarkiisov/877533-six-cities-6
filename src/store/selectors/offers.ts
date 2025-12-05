import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';

export const getOffers = (state: RootState) => state.offers.offers;
export const getOffersLoadingStatus = (state: RootState) =>
  state.offers.isLoading;
export const getOffersErrorStatus = (state: RootState) => state.offers.isError;

export const getOffersData = createSelector(
  [getOffers, getOffersLoadingStatus, getOffersErrorStatus],
  (offers, isLoading, isError) => ({
    offers,
    isLoading,
    isError,
  })
);
