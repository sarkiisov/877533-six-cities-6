import { Offer, Point } from '../types';

export const getPointFromOffer = (offer: Offer): Point => ({
  id: offer.id,
  latitude: offer.location.latitude,
  longitude: offer.location.longitude,
  title: offer.title,
});
