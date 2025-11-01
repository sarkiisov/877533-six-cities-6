import clsx from 'clsx';
import { CityListProps } from './CityList.types';

export const CityList = ({
  cities,
  onCityChange,
  activeCity,
}: CityListProps) => (
  <div className="tabs">
    <section className="locations container">
      <ul className="locations__list tabs__list">
        {cities.map((city) => (
          <li className="locations__item" key={city.name}>
            <a
              onClick={() => {
                onCityChange(city);
              }}
              className={clsx('locations__item-link tabs__item', {
                'tabs__item--active': city === activeCity,
              })}
            >
              <span>{city.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  </div>
);
