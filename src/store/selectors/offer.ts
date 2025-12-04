import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';

export const getCurrentOffer = (state: RootState) => state.offer.offer;
export const getNearbyOffers = (state: RootState) => state.offer.nearbyOffers;
export const getComments = (state: RootState) => state.offer.comments;
export const getOfferLoadingStatus = (state: RootState) =>
  state.offer.isLoading;
export const getOfferErrorStatus = (state: RootState) => state.offer.isError;

export const getOfferData = createSelector(
  [getCurrentOffer, getOfferLoadingStatus, getOfferErrorStatus],
  (offer, isLoading, isError) => ({
    data: offer,
    isLoading,
    isError,
  })
);
