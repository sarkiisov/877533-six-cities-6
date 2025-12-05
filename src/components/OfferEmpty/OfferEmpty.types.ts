import { City } from '../../types';

export type OfferEmptyProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  city: City;
};
