import { City, Point } from '../../types';

export type MapProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  city: City;
  points: Point[];
  selectedPoint?: Point;
};
