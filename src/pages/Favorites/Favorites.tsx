import { OfferCardList } from '../../components/OfferCardList';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '../../store';
import { getFavoritesData } from '../../store/selectors/favorites';
import { Navigate } from 'react-router-dom';
import { Loader } from '../../components/Loader';
import { useEffect } from 'react';
import { fetchFavorites, toggleFavoriteOffer } from '../../store/api-actions';
import { Offer } from '../../types';

export const Favorites = () => {
  const dispatch = useDispatch<Dispatch>();

  const { favorites, isLoading, isError } = useSelector(getFavoritesData);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleToggleFavoriteClick = async (
    offer: Offer,
    isFavorite: boolean
  ) => {
    await dispatch(toggleFavoriteOffer(offer.id, isFavorite));
  };

  if (isError) {
    return <Navigate to="/404" />;
  }

  return (
    <div
      className={clsx('page', {
        'page--favorites-empty': !isLoading && !favorites.length,
      })}
    >
      <Header />
      <main
        className={clsx('page__main page__main--favorites', {
          'page__main--favorites-empty': !isLoading && !favorites.length,
        })}
      >
        {isLoading && <Loader />}
        {!isLoading &&
          (favorites.length ? (
            <div className="page__favorites-container container">
              <section className="favorites">
                <h1 className="favorites__title">Saved listing</h1>
                <ul className="favorites__list">
                  <OfferCardList
                    onOfferToggleFavorite={handleToggleFavoriteClick}
                    offers={favorites}
                    orientation="horizontal"
                  />
                </ul>
              </section>
            </div>
          ) : (
            <div className="page__favorites-container container">
              <section className="favorites favorites--empty">
                <h1 className="visually-hidden">Favorites (empty)</h1>
                <div className="favorites__status-wrapper">
                  <b className="favorites__status">Nothing yet saved.</b>
                  <p className="favorites__status-description">
                    Save properties to narrow down search or plan your future
                    trips.
                  </p>
                </div>
              </section>
            </div>
          ))}
      </main>
      <Footer />
    </div>
  );
};
