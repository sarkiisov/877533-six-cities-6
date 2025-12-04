import { OfferCardList } from '../../components/OfferCardList';
import { Map } from '../../components/Map';
import { CityList } from '../../components/CityList';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '../../store';
import { actions } from '../../store/action';
import { useEffect, useMemo, useState } from 'react';
import { cities } from '../../mocks';
import { City, Offer } from '../../types';
import { getPointFromOffer } from '../../utils/offer';
import { fetchOffers } from '../../store/api-action';
import { OfferSort } from '../../components/OfferSort';
import { Loader } from '../../components/Loader';
import { Header } from '../../components/Header';
import clsx from 'clsx';

export const Main = () => {
  const [hoveredOffer, setHoveredOffer] = useState<Offer | null>(null);

  const dispatch = useDispatch<Dispatch>();

  const { offers, city, isLoading } = useSelector(
    (state: RootState) => ({
      offers: state.offers,
      city: state.city,
      isLoading: state.isLoading,
    }),
    shallowEqual
  );

  const filteredOffers = useMemo(
    () => offers.filter((offer) => offer.city.name === city.name),
    [offers, city]
  );

  const handleCityChange = (nextCity: City) => {
    dispatch(actions.setCity(nextCity));
  };

  useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);

  return (
    <div className="page page--gray page--main">
      <Header />
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
          {isLoading && <Loader />}
          {!isLoading &&
            (filteredOffers.length ? (
              <div className="cities__places-container container">
                <section className="cities__places places">
                  <h2 className="visually-hidden">Places</h2>
                  <b className="places__found">
                    {filteredOffers.length} places to stay in {city.name}
                  </b>
                  <OfferSort />
                  <div className="cities__places-list places__list tabs__content">
                    <OfferCardList
                      onOfferHover={setHoveredOffer}
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
                    selectedPoint={hoveredOffer?.id}
                    city={city}
                  />
                </div>
              </div>
            ) : (
              <div className="cities__places-container cities__places-container--empty container">
                <section className="cities__no-places">
                  <div className="cities__status-wrapper tabs__content">
                    <b className="cities__status">
                      No places to stay available
                    </b>
                    <p className="cities__status-description">
                      We could not find any property available at the moment in
                      {city.name}
                    </p>
                  </div>
                </section>
                <div className="cities__right-section"></div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
};
