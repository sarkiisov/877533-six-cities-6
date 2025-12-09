import { CommentForm, CommentFormData } from '../../components/CommentForm';
import { CommentList } from '../../components/CommentList';
import { OfferCardList } from '../../components/OfferCardList';
import { Map } from '../../components/Map';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '../../store';
import { getPointFromOffer } from '../../utils/offer';
import { Header } from '../../components/Header';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import {
  fetchOffer,
  postComment,
  toggleFavoriteOffer,
} from '../../store/api-actions';
import { capitalize } from '../../utils/string';
import { Loader } from '../../components/Loader';
import { Footer } from '../../components/Footer';
import {
  getAuthStatus,
  getComments,
  getNearbyOffers,
  getOfferData,
} from '../../store/selectors';
import clsx from 'clsx';
import { Point } from '../../types';

export const Offer = () => {
  const { id } = useParams() as { id: string };

  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch<Dispatch>();

  const authStatus = useSelector(getAuthStatus);
  const { offer, isLoading, isError } = useSelector(getOfferData);
  const nearbyOffers = useSelector(getNearbyOffers);
  const comments = useSelector(getComments);

  const sortedComments = useMemo(
    () =>
      [...comments]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10),
    [comments]
  );

  const points = useMemo(
    () =>
      [
        offer ? getPointFromOffer(offer) : undefined,
        ...nearbyOffers.slice(0, 3).map(getPointFromOffer),
      ].filter(Boolean) as Point[],
    [offer, nearbyOffers]
  );

  const handleFormSubmit = async (comment: CommentFormData) => {
    await dispatch(postComment(id, comment));
  };

  const handleToggleFavoriteClick = async (isFavorite: boolean) => {
    if (authStatus === 'NO_AUTH') {
      navigate('/login');
    } else {
      setIsFavoriteLoading(true);
      try {
        await dispatch(toggleFavoriteOffer(id, isFavorite));
      } finally {
        setIsFavoriteLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    dispatch(fetchOffer(id));
  }, [id, dispatch]);

  if (isError) {
    return <Navigate to="/404" />;
  }

  return (
    <div className="page">
      <Header />
      <main className="page__main page__main--offer">
        {isLoading && <Loader />}
        {!isError && offer && (
          <>
            <section className="offer">
              <div className="offer__gallery-container container">
                <div className="offer__gallery">
                  {offer.images.slice(0, 6).map((image) => (
                    <div key={image} className="offer__image-wrapper">
                      <img
                        className="offer__image"
                        src={image}
                        alt="Photo studio"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="offer__container container">
                <div className="offer__wrapper">
                  {offer.isPremium && (
                    <div className="offer__mark">
                      <span>Premium</span>
                    </div>
                  )}
                  <div className="offer__name-wrapper">
                    <h1 className="offer__name">{offer.title}</h1>
                    <button
                      onClick={() =>
                        void handleToggleFavoriteClick(!offer.isFavorite)}
                      disabled={isFavoriteLoading}
                      className={clsx(
                        'offer__bookmark-button button',
                        offer.isFavorite && 'offer__bookmark-button--active'
                      )}
                      type="button"
                    >
                      <svg
                        className="offer__bookmark-icon"
                        width="31"
                        height="33"
                      >
                        <use xlinkHref="#icon-bookmark"></use>
                      </svg>
                      <span className="visually-hidden">To bookmarks</span>
                    </button>
                  </div>
                  <div className="offer__rating rating">
                    <div className="offer__stars rating__stars">
                      <span style={{ width: `${offer.rating * 20}%` }}></span>
                      <span className="visually-hidden">Rating</span>
                    </div>
                    <span className="offer__rating-value rating__value">
                      {Math.round(offer.rating)}
                    </span>
                  </div>
                  <ul className="offer__features">
                    <li className="offer__feature offer__feature--entire">
                      {capitalize(offer.type)}
                    </li>
                    <li className="offer__feature offer__feature--bedrooms">
                      {offer.bedrooms}{' '}
                      {`Bedroom${offer.bedrooms > 1 ? 's' : ''}`}
                    </li>
                    <li className="offer__feature offer__feature--adults">
                      Max {offer.maxAdults}{' '}
                      {`adult${offer.maxAdults > 1 ? 's' : ''}`}
                    </li>
                  </ul>
                  <div className="offer__price">
                    <b className="offer__price-value">&euro;{offer.price}</b>
                    <span className="offer__price-text">&nbsp;night</span>
                  </div>
                  <div className="offer__inside">
                    <h2 className="offer__inside-title">What&apos;s inside</h2>
                    <ul className="offer__inside-list">
                      {offer.goods.map((good) => (
                        <li key={good} className="offer__inside-item">
                          {good}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="offer__host">
                    <h2 className="offer__host-title">Meet the host</h2>
                    <div className="offer__host-user user">
                      <div
                        className={clsx(
                          'offer__avatar-wrapper  user__avatar-wrapper',
                          offer.host.isPro && 'offer__avatar-wrapper--pro'
                        )}
                      >
                        <img
                          className="offer__avatar user__avatar"
                          src={offer.host.avatarUrl}
                          width="74"
                          height="74"
                          alt="Host avatar"
                        />
                      </div>
                      <span className="offer__user-name">
                        {offer.host.name}
                      </span>
                      {offer.host.isPro && (
                        <span className="offer__user-status">Pro</span>
                      )}
                    </div>
                    <div className="offer__description">
                      <p className="offer__text">{offer.description}</p>
                    </div>
                  </div>
                  <section className="offer__reviews reviews">
                    <CommentList comments={sortedComments} />
                    {authStatus === 'AUTH' && (
                      <CommentForm onSubmit={handleFormSubmit} />
                    )}
                  </section>
                </div>
              </div>
              <Map
                className="offer__map map"
                style={{ backgroundImage: 'none' }}
                city={offer.city}
                points={points}
                selectedPoint={id}
              />
            </section>
            <div className="container">
              <section className="near-places places">
                <h2 className="near-places__title">
                  Other places in the neighborhood
                </h2>
                <div className="near-places__list places__list">
                  <OfferCardList offers={nearbyOffers} orientation="vertical" />
                </div>
              </section>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};
