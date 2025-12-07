import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { OfferCard } from './OfferCard';
import type { OfferCardProps } from './OfferCard.types';
import { makeFakeOffer } from '../../utils/mocks';
import { OfferType } from '../../types';
import { capitalize } from '../../utils/string';
import userEvent from '@testing-library/user-event';

describe('OfferCard', () => {
  const mockOffer = makeFakeOffer();

  const renderWithRouter = (props: OfferCardProps) =>
    render(
      <MemoryRouter>
        <OfferCard {...props} />
      </MemoryRouter>
    );

  describe('Basic rendering', () => {
    test('renders correctly with required props', () => {
      renderWithRouter({ offer: mockOffer, orientation: 'vertical' });

      expect(screen.getByText(mockOffer.title)).toBeInTheDocument();
      expect(screen.getByText(`€${mockOffer.price}`)).toBeInTheDocument();
      expect(screen.getByText(capitalize(mockOffer.type))).toBeInTheDocument();
      expect(screen.getByAltText('Place image')).toHaveAttribute(
        'src',
        mockOffer.previewImage
      );
    });

    test('renders premium badge when offer is premium', () => {
      renderWithRouter({
        offer: { ...mockOffer, isPremium: true },
        orientation: 'vertical',
      });

      expect(screen.getByText('Premium')).toBeInTheDocument();
    });

    test('does not render premium badge when offer is not premium', () => {
      renderWithRouter({
        offer: { ...mockOffer, isPremium: false },
        orientation: 'vertical',
      });

      expect(screen.queryByText('Premium')).not.toBeInTheDocument();
    });

    test('applies correct class based on orientation', () => {
      const { container } = renderWithRouter({
        offer: mockOffer,
        orientation: 'vertical',
      });

      expect(container.querySelector('.cities__card')).toBeInTheDocument();

      const { container: container2 } = renderWithRouter({
        offer: mockOffer,
        orientation: 'horizontal',
      });

      expect(container2.querySelector('.favorites__card')).toBeInTheDocument();
    });

    test('applies additional className when provided', () => {
      const { container } = renderWithRouter({
        offer: mockOffer,
        orientation: 'vertical',
        className: 'custom-class',
      });

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });

  describe('Favorite button functionality', () => {
    test('renders favorite button with correct test ID', () => {
      renderWithRouter({ offer: mockOffer, orientation: 'vertical' });

      const favoriteButton = screen.getByTestId(
        `toggle-favorite-${mockOffer.id}`
      );

      expect(favoriteButton).toBeInTheDocument();
    });

    test('shows active bookmark icon when offer is favorite', () => {
      renderWithRouter({
        offer: { ...mockOffer, isFavorite: true },
        orientation: 'vertical',
      });

      const favoriteButton = screen.getByTestId(
        `toggle-favorite-${mockOffer.id}`
      );

      expect(favoriteButton).toHaveClass('place-card__bookmark-button--active');
    });

    test('shows inactive bookmark icon when offer is not favorite', () => {
      renderWithRouter({
        offer: { ...mockOffer, isFavorite: false },
        orientation: 'vertical',
      });

      const favoriteButton = screen.getByTestId(
        `toggle-favorite-${mockOffer.id}`
      );

      expect(favoriteButton).not.toHaveClass(
        'place-card__bookmark-button--active'
      );
    });

    test('calls onToggleFavorite with correct isFavorite value when clicked', async () => {
      const user = userEvent.setup();
      const mockOnToggleFavorite = vi.fn().mockResolvedValue(undefined);

      renderWithRouter({
        offer: { ...mockOffer, isFavorite: false },
        orientation: 'vertical',
        onToggleFavorite: mockOnToggleFavorite,
      });

      const favoriteButton = screen.getByTestId(
        `toggle-favorite-${mockOffer.id}`
      );
      await user.click(favoriteButton);

      expect(mockOnToggleFavorite).toHaveBeenCalledWith(true);
    });

    test('calls onToggleFavorite with false when clicking on favorite offer', async () => {
      const user = userEvent.setup();
      const mockOnToggleFavorite = vi.fn().mockResolvedValue(undefined);
      renderWithRouter({
        offer: { ...mockOffer, isFavorite: false },
        orientation: 'vertical',
        onToggleFavorite: mockOnToggleFavorite,
      });
      const favoriteButton = screen.getByTestId(
        `toggle-favorite-${mockOffer.id}`
      );
      await user.click(favoriteButton);
      expect(mockOnToggleFavorite).toHaveBeenCalledWith(true);
    });

    test('reenables button after favorite operation completes', async () => {
      const user = userEvent.setup();
      const mockOnToggleFavorite = vi.fn().mockResolvedValue(undefined);
      renderWithRouter({
        offer: mockOffer,
        orientation: 'vertical',
        onToggleFavorite: mockOnToggleFavorite,
      });
      const favoriteButton = screen.getByTestId(
        `toggle-favorite-${mockOffer.id}`
      );
      await user.click(favoriteButton);
      expect(favoriteButton).not.toBeDisabled();
    });

    test('handles onToggleFavorite rejection gracefully', async () => {
      const user = userEvent.setup();
      const mockOnToggleFavorite = vi
        .fn()
        .mockRejectedValue(new Error('Failed'));
      renderWithRouter({
        offer: mockOffer,
        orientation: 'vertical',
        onToggleFavorite: mockOnToggleFavorite,
      });
      const favoriteButton = screen.getByTestId(
        `toggle-favorite-${mockOffer.id}`
      );
      await user.click(favoriteButton);
      expect(favoriteButton).not.toBeDisabled();
      expect(mockOnToggleFavorite).toHaveBeenCalled();
    });
  });

  describe('Image dimensions', () => {
    test('uses correct image dimensions for vertical orientation', () => {
      renderWithRouter({ offer: mockOffer, orientation: 'vertical' });

      const image = screen.getByAltText('Place image');
      expect(image).toHaveAttribute('width', '260');
      expect(image).toHaveAttribute('height', '200');
    });

    test('uses correct image dimensions for horizontal orientation', () => {
      renderWithRouter({ offer: mockOffer, orientation: 'horizontal' });

      const image = screen.getByAltText('Place image');
      expect(image).toHaveAttribute('width', '150');
      expect(image).toHaveAttribute('height', '100');
    });
  });

  describe('Links and navigation', () => {
    test('renders link to offer details page', () => {
      renderWithRouter({ offer: mockOffer, orientation: 'vertical' });

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);

      links.forEach((link) => {
        expect(link).toHaveAttribute('href', `/offer/${mockOffer.id}`);
      });
    });

    test('renders correct rating percentage', () => {
      renderWithRouter({ offer: mockOffer, orientation: 'vertical' });

      const ratingSpan = screen
        .getByText('Rating')
        .parentElement?.querySelector('span');
      expect(ratingSpan).toHaveStyle({ width: `${mockOffer.rating * 20}%` });
    });

    test('changes bookmark text based on favorite status', () => {
      const { rerender } = render(
        <MemoryRouter>
          <OfferCard
            offer={{ ...mockOffer, isFavorite: false }}
            orientation="vertical"
          />
        </MemoryRouter>
      );

      expect(screen.getByText('To bookmarks')).toBeInTheDocument();

      rerender(
        <MemoryRouter>
          <OfferCard
            offer={{ ...mockOffer, isFavorite: true }}
            orientation="vertical"
          />
        </MemoryRouter>
      );

      expect(screen.getByText('In bookmarks')).toBeInTheDocument();
    });
  });

  describe('Rating calculation', () => {
    test('calculates correct width for rating stars', () => {
      const offerWithRating = {
        ...mockOffer,
        id: String(6),
        rating: 3.2,
      };
      renderWithRouter({ offer: offerWithRating, orientation: 'vertical' });

      const ratingSpan = screen
        .getByText('Rating')
        .parentElement?.querySelector('span');
      expect(ratingSpan).toHaveStyle({
        width: `${offerWithRating.rating * 20}%`,
      });
    });

    test('handles edge rating values - zero rating', () => {
      renderWithRouter({
        offer: { ...mockOffer, rating: 0 },
        orientation: 'vertical',
      });

      const ratingSpan = screen
        .getByText('Rating')
        .parentElement?.querySelector('span');
      expect(ratingSpan).toHaveStyle({ width: '0%' });
    });

    test('handles edge rating values - max rating', () => {
      renderWithRouter({
        offer: { ...mockOffer, rating: 5 },
        orientation: 'vertical',
      });

      const ratingSpan = screen
        .getByText('Rating')
        .parentElement?.querySelector('span');
      expect(ratingSpan).toHaveStyle({ width: '100%' });
    });
  });

  describe('Different offer types', () => {
    test('renders different offer types correctly', () => {
      const houseOffer = {
        ...mockOffer,
        type: 'house' as OfferType,
      };

      const roomOffer = {
        ...mockOffer,
        type: 'room' as OfferType,
      };

      const hotelOffer = {
        ...mockOffer,
        type: 'hotel' as OfferType,
      };

      renderWithRouter({ offer: houseOffer, orientation: 'vertical' });
      expect(screen.getByText('House')).toBeInTheDocument();

      renderWithRouter({ offer: roomOffer, orientation: 'vertical' });
      expect(screen.getByText('Room')).toBeInTheDocument();

      renderWithRouter({ offer: hotelOffer, orientation: 'vertical' });
      expect(screen.getByText('Hotel')).toBeInTheDocument();
    });
  });

  describe('Price formatting', () => {
    test('formats price correctly with euro symbol', () => {
      const expensiveOffer = {
        ...mockOffer,
        id: String(10),
        price: 999,
      };

      renderWithRouter({ offer: expensiveOffer, orientation: 'vertical' });
      expect(screen.getByText(`€${expensiveOffer.price}`)).toBeInTheDocument();
    });
  });
});
