import { Offer } from '../../types';
import { OfferCardProps } from '../OfferCard/OfferCard.types';

export type OfferCardListProps = Pick<OfferCardProps, 'orientation'> & {
  offers: Offer[];
};
