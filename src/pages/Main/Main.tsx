import { OfferCardList } from '../../components/OfferCardList';
import { Map } from '../../components/Map';
import { CityList } from '../../components/CityList';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '../../store';
import { actions } from '../../store/actions';
import { useEffect, useMemo, useState } from 'react';
import { cities } from '../../utils/consts';
import { City, Offer } from '../../types';
import { getPointFromOffer } from '../../utils/offer';
import { fetchOffers, toggleFavoriteOffer } from '../../store/api-actions';
import { OfferSort } from '../../components/OfferSort';
import { Loader } from '../../components/Loader';
import { Header } from '../../components/Header';
import { getCity, getOffersData } from '../../store/selectors';
import { Navigate } from 'react-router-dom';
import { OfferEmpty } from '../../components/OfferEmpty';
import clsx from 'clsx';

export const Main = () => {
  const [hoveredOffer, setHoveredOffer] = useState<Offer | null>(null);

  const dispatch = useDispatch<Dispatch>();

  const city = useSelector(getCity);

  const { offers, isLoading, isError } = useSelector(getOffersData);

  const filteredOffers = useMemo(
    () => offers.filter((offer) => offer.city.name === city.name),
    [offers, city]
  );

  const handleCityChange = (nextCity: City) => {
    dispatch(actions.setCity(nextCity));
  };

  const handleToggleFavoriteClick = async (
    offer: Offer,
    isFavorite: boolean
  ) => {
    await dispatch(toggleFavoriteOffer(offer.id, isFavorite));
  };

  useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);

  if (isError) {
    return <Navigate to="/404" />;
  }

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
                      onOfferToggleFavorite={handleToggleFavoriteClick}
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
              <OfferEmpty city={city} />
            ))}
        </div>
      </main>
    </div>
  );
};
