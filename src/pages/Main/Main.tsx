import { OfferCardList } from '../../components/OfferCardList';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Map } from '../../components/Map';
import { CityList } from '../../components/CityList';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setCity } from '../../store/action';
import { useMemo } from 'react';
import { cities } from '../../mocks';
import { City } from '../../types';
import { getPointFromOffer } from '../../utils/offer';

export const Main = () => {
  const { offers, city } = useSelector((state: RootState) => state);

  const dispatch = useDispatch();

  const filteredOffers = useMemo(
    () => offers.filter((offer) => offer.city.name === city.name),
    [offers, city]
  );

  const handleCityChange = (nextCity: City) => {
    dispatch(setCity(nextCity));
  };

  return (
    <div className="page page--gray page--main">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <a className="header__logo-link header__logo-link--active">
                <img
                  className="header__logo"
                  src="img/logo.svg"
                  alt="6 cities logo"
                  width="81"
                  height="41"
                />
              </a>
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                <li className="header__nav-item user">
                  <Link
                    className="header__nav-link header__nav-link--profile"
                    to="/favorites"
                  >
                    <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                    <span className="header__user-name user__name">
                      Oliver.conner@gmail.com
                    </span>
                    <span className="header__favorite-count">3</span>
                  </Link>
                </li>
                <li className="header__nav-item">
                  <a className="header__nav-link" href="#">
                    <span className="header__signout">Sign out</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main
        className={clsx('page__main page__main--index', {
          'page__main--index-empty': !filteredOffers.length,
        })}
      >
        <h1 className="visually-hidden">Cities</h1>
        <CityList
          cities={cities}
          onCityChange={handleCityChange}
          activeCity={city}
        />
        <div className="cities">
          {filteredOffers.length ? (
            <div className="cities__places-container container">
              <section className="cities__places places">
                <h2 className="visually-hidden">Places</h2>
                <b className="places__found">
                  {filteredOffers.length} places to stay in {city.name}
                </b>
                <form className="places__sorting" action="#" method="get">
                  <span className="places__sorting-caption">Sort by</span>
                  <span className="places__sorting-type" tabIndex={0}>
                    Popular
                    <svg className="places__sorting-arrow" width="7" height="4">
                      <use xlinkHref="#icon-arrow-select"></use>
                    </svg>
                  </span>
                  <ul className="places__options places__options--custom places__options--opened">
                    <li
                      className="places__option places__option--active"
                      tabIndex={0}
                    >
                      Popular
                    </li>
                    <li className="places__option" tabIndex={0}>
                      Price: low to high
                    </li>
                    <li className="places__option" tabIndex={0}>
                      Price: high to low
                    </li>
                    <li className="places__option" tabIndex={0}>
                      Top rated first
                    </li>
                  </ul>
                </form>
                <div className="cities__places-list places__list tabs__content">
                  <OfferCardList
                    offers={filteredOffers}
                    orientation="vertical"
                  />
                </div>
              </section>
              <div className="cities__right-section">
                <Map
                  style={{ backgroundImage: 'none' }}
                  className="cities__map map"
                  points={filteredOffers.map(getPointFromOffer)}
                  city={city}
                />
              </div>
            </div>
          ) : (
            <div className="cities__places-container cities__places-container--empty container">
              <section className="cities__no-places">
                <div className="cities__status-wrapper tabs__content">
                  <b className="cities__status">No places to stay available</b>
                  <p className="cities__status-description">
                    We could not find any property available at the moment in
                    {city.name}
                  </p>
                </div>
              </section>
              <div className="cities__right-section"></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
