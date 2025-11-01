import { Dispatch } from 'react';
import { City } from '../../types';

export type CityListProps = {
  cities: City[];
  onCityChange: Dispatch<City>;
  activeCity: City;
};
