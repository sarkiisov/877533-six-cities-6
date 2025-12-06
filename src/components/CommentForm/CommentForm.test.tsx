import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { CommentForm } from './CommentForm';

describe('CommentForm component', () => {
  test('should render correctly with default props', () => {
    render(<CommentForm />);

    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass('reviews__form');
    expect(form).toHaveClass('form');

    const label = screen.getByText('Your review');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'review');
    expect(label).toHaveClass('reviews__label');
    expect(label).toHaveClass('form__label');

    const ratingContainer = screen.getByText('Your review').nextElementSibling;
    expect(ratingContainer).toHaveClass('reviews__rating-form');
    expect(ratingContainer).toHaveClass('form__rating');

    const ratingInputs = screen.getAllByRole('radio');
    expect(ratingInputs).toHaveLength(5);

    ratingInputs.forEach((input) => {
      expect(input).toHaveClass('form__rating-input');
      expect(input).toHaveClass('visually-hidden');
      expect(input).toHaveAttribute('name', 'rating');
    });

    const starLabels = screen.getAllByTitle('perfect');
    expect(starLabels).toHaveLength(5);

    starLabels.forEach((star) => {
      expect(star).toHaveClass('reviews__rating-label');
      expect(star).toHaveClass('form__rating-label');

      const svg = star.querySelector('svg');
      expect(svg).toHaveClass('form__star-image');
      expect(svg).toHaveAttribute('width', '37');
      expect(svg).toHaveAttribute('height', '33');

      const useElement = svg?.querySelector('use');
      expect(useElement).toHaveAttribute('xlink:href', '#icon-star');
    });

    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveClass('reviews__textarea');
    expect(textarea).toHaveClass('form__textarea');
    expect(textarea).toHaveAttribute('id', 'comment');
    expect(textarea).toHaveAttribute('name', 'comment');
    expect(textarea).toHaveAttribute('minLength', '50');
    expect(textarea).toHaveAttribute(
      'placeholder',
      'Tell how was your stay, what you like and what can be improved'
    );

    const buttonWrapper = textarea.nextElementSibling;
    expect(buttonWrapper).toHaveClass('reviews__button-wrapper');

    const helpText = screen.getByText(
      /To submit review please make sure to set/
    );
    expect(helpText).toBeInTheDocument();
    expect(helpText).toHaveClass('reviews__help');

    const ratingSpan = screen.getByText('rating');
    expect(ratingSpan).toBeInTheDocument();
    expect(ratingSpan).toHaveClass('reviews__star');

    const charsText = screen.getByText('50 characters');
    expect(charsText).toBeInTheDocument();
    expect(charsText.tagName).toBe('B');
    expect(charsText).toHaveClass('reviews__text-amount');

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
    expect(submitButton).toHaveClass('reviews__submit');
    expect(submitButton).toHaveClass('form__submit');
    expect(submitButton).toHaveClass('button');
    expect(submitButton).toBeDisabled();
  });

  test('should render without onSubmit prop', () => {
    expect(() => {
      render(<CommentForm />);
    }).not.toThrow();

    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(5);
  });

  describe('CommentForm rating boundary values', () => {
    const testCases = [
      { rating: 1, description: 'minimum rating (1 star)' },
      { rating: 2, description: 'rating 2 stars' },
      { rating: 3, description: 'middle rating (3 stars)' },
      { rating: 4, description: 'rating 4 stars' },
      { rating: 5, description: 'maximum rating (5 stars)' },
    ];

    testCases.forEach(({ rating, description }) => {
      test(`should handle ${description}`, () => {
        const ratingValues = { rating, comment: 'Test comment' };

        render(<CommentForm defaultValues={ratingValues} />);

        const ratingInputs = screen.getAllByRole('radio');
        const checkedInput = ratingInputs.find(
          (input) => (input as HTMLInputElement).checked
        );

        expect(checkedInput).toBeDefined();
        expect((checkedInput as HTMLInputElement)?.value).toBe(
          rating.toString()
        );
        expect(checkedInput?.id).toBe(`${rating}-stars`);
      });
    });
  });

  test('should handle exactly 50 characters comment', async () => {
    const user = userEvent.setup();
    render(<CommentForm />);

    const textarea = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    const ratingInputs = screen.getAllByRole('radio');

    await user.click(ratingInputs[0]);

    const exactly50Chars = 'A'.repeat(50);
    await user.type(textarea, exactly50Chars);

    expect(submitButton).not.toBeDisabled();
  });
});
