import { Offer } from '../../types';

export type OfferCardClassNames = 'root' | 'imageWrapper' | 'info';

export type OfferCardOrientation = 'horizontal' | 'vertical';

export type OfferCardProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  offer: Offer;
  orientation: OfferCardOrientation;
  onToggleFavorite?: (isFavorite: boolean) => Promise<void>;
};
