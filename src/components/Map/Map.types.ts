import { City, Point } from '../../types';

export type MapProps = {
  city: City;
  points: Point[];
  selectedPoint?: Point;
};
