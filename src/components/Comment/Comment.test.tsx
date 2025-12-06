import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { Comment } from './Comment';
import { CommentProps } from './Comment.types';
import { makeFakeComment } from '../../utils/mocks';

describe('Comment component', () => {
  const mockComment = makeFakeComment();

  const defaultProps: CommentProps = { comment: mockComment };

  const mockToLocaleString = vi.fn().mockReturnValue('January 2024');

  beforeAll(() => {
    vi.spyOn(global.Date.prototype, 'toLocaleString').mockImplementation(
      mockToLocaleString
    );
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test('should render correctly with all data', () => {
    render(<Comment {...defaultProps} />);

    expect(screen.getByRole('listitem')).toBeInTheDocument();
    expect(screen.getByRole('listitem')).toHaveClass('reviews__item');

    const avatar = screen.getByAltText('Reviews avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', mockComment.user.avatarUrl);
    expect(avatar).toHaveAttribute('width', '54');
    expect(avatar).toHaveAttribute('height', '54');
    expect(avatar).toHaveClass('reviews__avatar');
    expect(avatar).toHaveClass('user__avatar');

    const avatarWrapper = avatar.closest('.reviews__avatar-wrapper');
    expect(avatarWrapper).toHaveClass('reviews__avatar-wrapper');
    expect(avatarWrapper).toHaveClass('user__avatar-wrapper');

    expect(screen.getByText(mockComment.user.name)).toBeInTheDocument();
    expect(screen.getByText(mockComment.user.name)).toHaveClass(
      'reviews__user-name'
    );

    const ratingContainer = screen
      .getByText('Rating')
      .closest('.reviews__rating');
    expect(ratingContainer).toHaveClass('reviews__rating');
    expect(ratingContainer).toHaveClass('rating');

    const starsContainer = screen
      .getByText('Rating')
      .closest('.reviews__stars');
    expect(starsContainer).toHaveClass('reviews__stars');
    expect(starsContainer).toHaveClass('rating__stars');

    const ratingSpan = starsContainer?.querySelector('span');
    expect(ratingSpan).toHaveStyle({ width: `${mockComment.rating * 20}%` });

    const hiddenRating = screen.getByText('Rating');
    expect(hiddenRating).toBeInTheDocument();
    expect(hiddenRating).toHaveClass('visually-hidden');

    expect(screen.getByText(mockComment.comment)).toBeInTheDocument();
    expect(screen.getByText(mockComment.comment)).toHaveClass('reviews__text');

    const expectedDate = new Date(mockComment.date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
    });

    expect(screen.getByText(expectedDate)).toBeInTheDocument();

    const timeElement = screen.getByText(expectedDate);
    expect(timeElement).toBeInTheDocument();
    expect(timeElement.tagName).toBe('TIME');
    expect(timeElement).toHaveClass('reviews__time');
    expect(timeElement).toHaveAttribute('dateTime', mockComment.date);
  });

  test('should format date correctly', () => {
    render(<Comment {...defaultProps} />);

    expect(mockToLocaleString).toHaveBeenCalledWith('en-US', {
      year: 'numeric',
      month: 'long',
    });

    expect(screen.getByText('January 2024')).toBeInTheDocument();
  });

  test('should calculate correct rating width', () => {
    const testCases = [
      { rating: 5, expectedWidth: '100%' },
      { rating: 4, expectedWidth: '80%' },
      { rating: 3.5, expectedWidth: '70%' },
      { rating: 1, expectedWidth: '20%' },
      { rating: 0, expectedWidth: '0%' },
    ];

    testCases.forEach(({ rating, expectedWidth }) => {
      const props = {
        comment: {
          ...defaultProps.comment,
          rating,
        },
      };

      const { container, unmount } = render(<Comment {...props} />);
      const ratingSpan = container.querySelector('.reviews__stars span');
      expect(ratingSpan).toHaveStyle({ width: expectedWidth });

      unmount();
    });
  });

  test('should render with different user data', () => {
    const propsWithProUser: CommentProps = {
      comment: {
        ...defaultProps.comment,
        user: {
          name: 'Jane Smith',
          avatarUrl: '/avatar2.png',
          isPro: true,
        },
      },
    };

    render(<Comment {...propsWithProUser} />);

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();

    const avatar = screen.getByAltText('Reviews avatar');
    expect(avatar).toHaveAttribute('src', '/avatar2.png');
  });

  test('should render with different comment text', () => {
    const propsWithDifferentComment: CommentProps = {
      comment: {
        ...defaultProps.comment,
        comment: 'Very poor experience. Would not recommend.',
      },
    };

    render(<Comment {...propsWithDifferentComment} />);

    expect(
      screen.getByText('Very poor experience. Would not recommend.')
    ).toBeInTheDocument();
  });

  test('should render with different date', () => {
    const differentDate = '2023-06-10T14:20:00.000Z';
    const mockToLocaleStringJune = vi.fn().mockReturnValue('June 2023');

    vi.spyOn(global.Date.prototype, 'toLocaleString').mockImplementation(
      mockToLocaleStringJune
    );

    const propsWithDifferentDate: CommentProps = {
      comment: {
        ...defaultProps.comment,
        date: differentDate,
      },
    };

    render(<Comment {...propsWithDifferentDate} />);

    expect(screen.getByText('June 2023')).toBeInTheDocument();
    expect(mockToLocaleStringJune).toHaveBeenCalledWith('en-US', {
      year: 'numeric',
      month: 'long',
    });

    vi.restoreAllMocks();
  });

  test('should have correct HTML structure', () => {
    const { container } = render(<Comment {...defaultProps} />);

    const listItem = container.firstChild as HTMLElement;
    expect(listItem.tagName).toBe('LI');

    const userDiv = listItem.querySelector('.reviews__user');
    expect(userDiv).toBeInTheDocument();

    const infoDiv = listItem.querySelector('.reviews__info');
    expect(infoDiv).toBeInTheDocument();

    const ratingDiv = infoDiv?.querySelector('.reviews__rating');
    expect(ratingDiv).toBeInTheDocument();

    const textParagraph = infoDiv?.querySelector('.reviews__text');
    expect(textParagraph).toBeInTheDocument();

    const timeElement = infoDiv?.querySelector('time');
    expect(timeElement).toBeInTheDocument();
  });
});
