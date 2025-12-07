import { Dispatch } from 'react';
import { City } from '../../types';

export type CityListProps = {
  cities: readonly City[];
  onCityChange: Dispatch<City>;
  activeCity?: City;
};
