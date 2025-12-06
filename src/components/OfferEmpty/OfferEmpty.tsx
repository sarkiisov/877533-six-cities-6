import clsx from 'clsx';
import { OfferEmptyProps } from './OfferEmpty.types';

export const OfferEmpty = ({ city, className, ...props }: OfferEmptyProps) => (
  <div
    className={clsx(
      'cities__places-container cities__places-container--empty container',
      className
    )}
    {...props}
  >
    <section className="cities__no-places">
      <div className="cities__status-wrapper tabs__content">
        <b className="cities__status">No places to stay available</b>
        <p className="cities__status-description">
          We could not find any property available at the moment in {city.name}
        </p>
      </div>
    </section>
    <div className="cities__right-section"></div>
  </div>
);
