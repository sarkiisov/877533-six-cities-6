import { Offer, Point } from '../types';

export const getPointFromOffer = (offer: Offer): Point => ({
  id: offer.id,
  latitude: offer.location.latitude,
  longitude: offer.location.longitude,
  title: offer.title,
});

export const getGroupedOffers = (offers: Offer[]): Record<string, Offer[]> => {
  if (!offers.length) {
    return {};
  }

  const offersByCities: Record<string, Offer[]> = {};

  offers.forEach((offer) => {
    const cityName = offer.city.name;
    if (offersByCities[cityName]) {
      offersByCities[cityName].push(offer);
    } else {
      offersByCities[cityName] = [offer];
    }
  });

  return offersByCities;
};
