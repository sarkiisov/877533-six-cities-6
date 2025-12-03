import { Dispatch } from 'react';

export const OFFER_SORT_OPTIONS = [
  { label: 'Popular', value: 'popular' },
  { label: 'Price: low to high', value: 'price:low-to-high' },
  { label: 'Price: high to low', value: 'price:hight-to-low' },
  { label: 'Top rated first', value: 'top-rated-first' },
] as const;

export type OfferSortValue = (typeof OFFER_SORT_OPTIONS)[number]['value'];

export type OfferSortProps = {
  defaultValue?: OfferSortValue;
  onChange?: Dispatch<OfferSortValue>;
};
