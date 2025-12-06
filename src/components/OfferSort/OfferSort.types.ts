import { Dispatch } from 'react';

export type OfferSortOption = {
  value: string;
  label: string;
};

export type OfferSortProps<T> = {
  options: readonly OfferSortOption[];
  value: T;
  onChange?: Dispatch<T>;
};
