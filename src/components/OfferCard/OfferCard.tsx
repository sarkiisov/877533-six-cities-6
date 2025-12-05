import clsx from 'clsx';
import { OfferCardClassNames, OfferCardProps } from './OfferCard.types';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';

export const OfferCard = ({
  offer,
  className,
  orientation,
  onToggleFavorite,
  ...props
}: OfferCardProps) => {
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const { previewImageWidth, previewImageHeight, classNames } = useMemo<{
    previewImageWidth: number;
    previewImageHeight: number;
    classNames: Partial<Record<OfferCardClassNames, string>>;
  }>(
    () =>
      ({
        horizontal: {
          previewImageWidth: 150,
          previewImageHeight: 100,
          classNames: {
            root: 'favorites__card',
            imageWrapper: 'favorites__image-wrapper',
            info: 'favorites__card-info',
          },
        },
        vertical: {
          previewImageWidth: 260,
          previewImageHeight: 200,
          classNames: {
            root: 'cities__card',
            imageWrapper: 'cities__image-wrapper',
          },
        },
      }[orientation]),
    [orientation]
  );

  const handleToggleFavorite = async (isFavorite: boolean) => {
    setIsFavoriteLoading(true);
    try {
      await onToggleFavorite?.(isFavorite);
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  return (
    <article
      className={clsx('place-card', classNames.root, className)}
      {...props}
    >
      {offer.isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <div
        className={clsx('place-card__image-wrapper', classNames.imageWrapper)}
      >
        <Link to={`/offer/${offer.id}`}>
          <img
            className="place-card__image"
            src={offer.previewImage}
            width={previewImageWidth}
            height={previewImageHeight}
            alt="Place image"
          />
        </Link>
      </div>
      <div className={clsx('place-card__info', classNames.info)}>
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{offer.price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>

          <button
            onClick={() => void handleToggleFavorite(!offer.isFavorite)}
            disabled={isFavoriteLoading}
            className={clsx('place-card__bookmark-button button', {
              'place-card__bookmark-button--active': offer.isFavorite,
            })}
            type="button"
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">
              {offer.isFavorite ? 'In bookmarks' : 'To bookmarks'}
            </span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: `${offer.rating * 20}%` }}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`/offer/${offer.id}`}>{offer.title}</Link>
        </h2>
        <p className="place-card__type">{offer.type}</p>
      </div>
    </article>
  );
};
