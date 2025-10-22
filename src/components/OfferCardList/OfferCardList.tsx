import { OfferCard } from '../OfferCard';
import { OfferCardListProps } from './OfferCardList.types';
import { Offer } from '../../types';

const getGroupedOffers = (offers: Offer[]) => {
  if (!offers.length) {
    return {};
  }

  const offersByCities: Record<string, Offer[]> = {};

  offers.forEach((offer) => {
    const cityName = offer.city.name;
    if (offersByCities[cityName]) {
      offersByCities[cityName].push(offer);
    } else {
      offersByCities[cityName] = [];
    }
  });

  return offersByCities;
};

export const OfferCardList = ({ offers, orientation }: OfferCardListProps) => {
  if (orientation === 'horizontal') {
    const groupedOffers = getGroupedOffers(offers);

    return Object.keys(groupedOffers).map((cityName) => (
      <li className="favorites__locations-items" key={cityName}>
        <div className="favorites__locations locations locations--current">
          <div className="locations__item">
            <a className="locations__item-link" href="#">
              <span>{cityName}</span>
            </a>
          </div>
        </div>
        <div className="favorites__places">
          {groupedOffers[cityName].map((offer) => (
            <OfferCard key={offer.id} offer={offer} orientation="horizontal" />
          ))}
        </div>
      </li>
    ));
  }
  if (orientation === 'vertical') {
    return offers.map((offer) => (
      <OfferCard key={offer.id} offer={offer} orientation="vertical" />
    ));
  }
};
