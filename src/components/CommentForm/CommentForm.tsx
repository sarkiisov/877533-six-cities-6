import { Fragment, useState } from 'react';
import { CommentFormData, CommentFormProps } from './CommentForm.types';
import classes from './CommentForm.module.css';
import clsx from 'clsx';

const fallbackDefaultValues: CommentFormData = { rating: 4, comment: '' };

export const CommentForm = ({
  defaultValues,
  onSubmit,
  className,
  ...props
}: CommentFormProps) => {
  const [formData, setFormData] = useState<CommentFormData>(
    defaultValues ?? fallbackDefaultValues
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);

  const isSubmitDisabled =
    isSubmitting ||
    !formData.rating ||
    !(formData.comment.length >= 50 && formData.comment.length <= 300);

  const handleFieldChange = (
    event: React.ChangeEvent,
    options?: Partial<{ isNumber: boolean }>
  ) => {
    const { name, value } = event.target as HTMLInputElement;

    setFormData({
      ...formData,
      [name]: options?.isNumber ? Number(value) : value,
    });
  };

  const handleFormSubmit = async (
    event: React.FormEvent,
    data: CommentFormData
  ) => {
    event.preventDefault();

    setIsSubmitting(true);
    setIsError(false);

    try {
      await onSubmit?.(data);
      setFormData(fallbackDefaultValues);
    } catch {
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      role="form"
      className={clsx('reviews__form form', className)}
      onSubmit={(event) => void handleFormSubmit(event, formData)}
      {...props}
    >
      <label className="reviews__label form__label" htmlFor="review">
        Your review
      </label>
      <div className="reviews__rating-form form__rating">
        {Array.from({ length: 5 }, (_, i) => 5 - i).map((rating) => (
          <Fragment key={rating}>
            <input
              role="radio"
              className="form__rating-input visually-hidden"
              name="rating"
              value={rating}
              id={`${rating}-stars`}
              type="radio"
              checked={formData.rating === rating}
              onChange={(event) => handleFieldChange(event, { isNumber: true })}
              readOnly={isSubmitting}
            />
            <label
              htmlFor={`${rating}-stars`}
              className="reviews__rating-label form__rating-label"
              title="perfect"
            >
              <svg className="form__star-image" width="37" height="33">
                <use xlinkHref="#icon-star"></use>
              </svg>
            </label>
          </Fragment>
        ))}
      </div>
      <textarea
        role="textbox"
        readOnly={isSubmitting}
        className="reviews__textarea form__textarea"
        id="comment"
        name="comment"
        minLength={50}
        maxLength={300}
        placeholder="Tell how was your stay, what you like and what can be improved"
        value={formData.comment}
        onChange={handleFieldChange}
      />
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set{' '}
          <span className="reviews__star">rating</span> and describe your stay
          with at least <b className="reviews__text-amount">50 characters</b>.
        </p>
        <button
          role="button"
          className="reviews__submit form__submit button"
          type="submit"
          disabled={isSubmitDisabled}
        >
          Submit
        </button>
      </div>
      <div>
        {isError && (
          <span className={classes['error-message']}>
            An error occurred while adding the review
          </span>
        )}
      </div>
    </form>
  );
};
