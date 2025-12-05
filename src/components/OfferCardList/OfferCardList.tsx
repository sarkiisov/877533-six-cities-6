import { OfferCard } from '../OfferCard';
import { OfferCardListProps } from './OfferCardList.types';
import { Offer } from '../../types';
import { useCallback } from 'react';
import { getGroupedOffers } from '../../utils/offer';

export const OfferCardList = ({
  offers,
  orientation,
  onOfferHover,
  onOfferToggleFavorite,
}: OfferCardListProps) => {
  const getOfferCardProps = useCallback(
    (offer: Offer) => ({
      onToggleFavorite: (isFavorite: boolean) =>
        onOfferToggleFavorite?.(offer, isFavorite) || Promise.resolve(),
      onMouseEnter: () => onOfferHover?.(offer),
      onMouseLeave: () => onOfferHover?.(null),

      offer: offer,
    }),
    [onOfferHover, onOfferToggleFavorite]
  );

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
            <OfferCard
              {...getOfferCardProps(offer)}
              key={offer.id}
              orientation="horizontal"
            />
          ))}
        </div>
      </li>
    ));
  }
  if (orientation === 'vertical') {
    return offers.map((offer) => (
      <OfferCard
        key={offer.id}
        {...getOfferCardProps(offer)}
        orientation="vertical"
      />
    ));
  }
};
