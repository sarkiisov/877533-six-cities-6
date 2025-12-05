import { Dispatch } from 'react';
import { Offer } from '../../types';
import { OfferCardProps } from '../OfferCard/OfferCard.types';

export type OfferCardListProps = Pick<OfferCardProps, 'orientation'> & {
  offers: Offer[];
  onOfferHover?: Dispatch<Offer | null>;
  onOfferToggleFavorite?: (offer: Offer, isFavorite: boolean) => Promise<void>;
};
