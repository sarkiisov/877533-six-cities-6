import { FavoritesProps } from './Favorites.types';
import { OfferCardList } from '../../components/OfferCardList';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Header } from '../../components/Header';

export const Favorites = ({ offers }: FavoritesProps) => (
  <div
    className={clsx('page', {
      'page--favorites-empty': !offers.length,
    })}
  >
    <Header />
    <main
      className={clsx('page__main page__main--favorites', {
        'page__main--favorites-empty': !offers.length,
      })}
    >
      {offers.length ? (
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>
            <ul className="favorites__list">
              <OfferCardList offers={offers} orientation="horizontal" />
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
                Save properties to narrow down search or plan your future trips.
              </p>
            </div>
          </section>
        </div>
      )}
    </main>
    <footer className="footer container">
      <Link className="footer__logo-link" to="/">
        <img
          className="footer__logo"
          src="img/logo.svg"
          alt="6 cities logo"
          width="64"
          height="33"
        />
      </Link>
    </footer>
  </div>
);
