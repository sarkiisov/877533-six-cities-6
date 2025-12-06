import { OfferCardList } from '../../components/OfferCardList';
import { Map } from '../../components/Map';
import { CityList } from '../../components/CityList';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '../../store';
import { actions } from '../../store/actions';
import { useEffect, useMemo, useState } from 'react';
import { CITIES, OFFER_SORT_OPTIONS } from '../../utils/consts';
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
import { offerComparators, OfferSortOption } from '../../utils/offerSort';

export const Main = () => {
  const [hoveredOffer, setHoveredOffer] = useState<Offer | null>(null);
  const [sort, setSort] = useState<OfferSortOption>('popular');

  const dispatch = useDispatch<Dispatch>();

  const city = useSelector(getCity);

  const { offers, isLoading, isError } = useSelector(getOffersData);

  const filteredAndSortedOffers = useMemo(() => {
    const filteredOffers = offers.filter(
      (offer) => offer.city.name === city.name
    );

    const sortedOffers = [...filteredOffers];
    return sortedOffers.sort(offerComparators[sort]);
  }, [offers, city, sort]);

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
          'page__main--index-empty': !filteredAndSortedOffers.length,
        })}
      >
        <h1 className="visually-hidden">Cities</h1>
        <CityList
          cities={CITIES}
          onCityChange={handleCityChange}
          activeCity={city}
        />
        <div className="cities">
          {isLoading && <Loader />}
          {!isLoading &&
            (filteredAndSortedOffers.length ? (
              <div className="cities__places-container container">
                <section className="cities__places places">
                  <h2 className="visually-hidden">Places</h2>
                  <b className="places__found">
                    {filteredAndSortedOffers.length} places to stay in{' '}
                    {city.name}
                  </b>
                  <OfferSort
                    options={OFFER_SORT_OPTIONS}
                    value={sort}
                    onChange={setSort}
                  />
                  <div className="cities__places-list places__list tabs__content">
                    <OfferCardList
                      onOfferToggleFavorite={handleToggleFavoriteClick}
                      onOfferHover={setHoveredOffer}
                      offers={filteredAndSortedOffers}
                      orientation="vertical"
                    />
                  </div>
                </section>
                <div className="cities__right-section">
                  <Map
                    style={{ backgroundImage: 'none' }}
                    className="cities__map map"
                    points={filteredAndSortedOffers.map(getPointFromOffer)}
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
