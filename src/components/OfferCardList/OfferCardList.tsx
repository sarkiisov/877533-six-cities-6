import { OfferCard } from '../OfferCard';
import { OfferCardListProps } from './OfferCardList.types';

export const OfferCardList = ({ offers, orientation }: OfferCardListProps) =>
  offers.map((offer) => (
    <OfferCard key={offer.id} offer={offer} orientation={orientation} />
  ));
