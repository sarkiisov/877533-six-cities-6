import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, Mock } from 'vitest';
import userEvent from '@testing-library/user-event';
import { OfferCardList } from './OfferCardList';
import { OfferCard, OfferCardProps } from '../OfferCard';
import { getGroupedOffers } from '../../utils/offer';
import { makeFakeOffers } from '../../utils/mocks';

vi.mock('../OfferCard', () => ({
  OfferCard: vi.fn(
    ({
      offer,
      onToggleFavorite,
      onMouseEnter,
      onMouseLeave,
      orientation,
    }: OfferCardProps) => (
      <div
        data-testid={`offer-card-${offer.id}`}
        data-orientation={orientation}
        data-favorite={offer.isFavorite}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {offer.title} ({orientation})
        <button
          data-testid={`toggle-favorite-${offer.id}`}
          onClick={() => void onToggleFavorite?.(!offer.isFavorite)}
        >
          Toggle Favorite
        </button>
      </div>
    )
  ),
}));

vi.mock('../../utils/offer', () => ({
  getGroupedOffers: vi.fn(),
}));

describe('OfferCardList component', () => {
  const mockOffers = makeFakeOffers(3).map((offer, index) => ({
    ...offer,
    id: String(index + 1),
    title: `Offer ${index + 1}`,
    city: {
      name: index < 2 ? 'Paris' : 'Berlin',
      location: { latitude: 0, longitude: 0, zoom: 12 },
    },
  }));

  const defaultProps = {
    offers: mockOffers,
    orientation: 'vertical' as const,
    onOfferHover: vi.fn(),
    onOfferToggleFavorite: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render vertical orientation correctly', () => {
    render(<OfferCardList {...defaultProps} />);

    mockOffers.forEach((offer) => {
      expect(screen.getByTestId(`offer-card-${offer.id}`)).toBeInTheDocument();
    });

    const cards = screen.getAllByTestId(/offer-card-/);
    expect(cards).toHaveLength(mockOffers.length);

    cards.forEach((card) => {
      expect(card).toHaveAttribute('data-orientation', 'vertical');
    });

    expect(OfferCard).toHaveBeenCalledTimes(mockOffers.length);
  });

  test('should render horizontal orientation with grouped offers', () => {
    const groupedOffers = {
      Paris: mockOffers.filter((offer) => offer.city.name === 'Paris'),
      Berlin: mockOffers.filter((offer) => offer.city.name === 'Berlin'),
    };

    (getGroupedOffers as Mock).mockReturnValue(groupedOffers);

    const props = {
      ...defaultProps,
      orientation: 'horizontal' as const,
    };

    render(<OfferCardList {...props} />);

    expect(getGroupedOffers).toHaveBeenCalledWith(mockOffers);

    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Berlin')).toBeInTheDocument();

    const cityItems = screen.getAllByRole('listitem');
    expect(cityItems).toHaveLength(Object.keys(groupedOffers).length);

    const cards = screen.getAllByTestId(/offer-card-/);
    expect(cards).toHaveLength(mockOffers.length);

    cards.forEach((card) => {
      expect(card).toHaveAttribute('data-orientation', 'horizontal');
    });
  });

  test('should call onOfferHover when mouse enters and leaves offer card', async () => {
    const user = userEvent.setup();
    const mockOnOfferHover = vi.fn();

    const props = {
      ...defaultProps,
      onOfferHover: mockOnOfferHover,
    };

    render(<OfferCardList {...props} />);

    const firstCard = screen.getByTestId(`offer-card-${mockOffers[0].id}`);

    await user.hover(firstCard);
    expect(mockOnOfferHover).toHaveBeenCalledWith(mockOffers[0]);

    await user.unhover(firstCard);
    expect(mockOnOfferHover).toHaveBeenCalledWith(null);
  });

  test('should call onOfferToggleFavorite when favorite button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnOfferToggleFavorite = vi.fn();

    const props = {
      ...defaultProps,
      onOfferToggleFavorite: mockOnOfferToggleFavorite,
    };

    render(<OfferCardList {...props} />);

    const firstOffer = mockOffers[0];
    const favoriteButton = screen.getByTestId(
      `toggle-favorite-${firstOffer.id}`
    );

    await user.click(favoriteButton);

    expect(mockOnOfferToggleFavorite).toHaveBeenCalledTimes(1);
    expect(mockOnOfferToggleFavorite).toHaveBeenCalledWith(
      firstOffer,
      !firstOffer.isFavorite
    );
  });

  test('should handle empty offers array', () => {
    const props = {
      ...defaultProps,
      offers: [],
    };

    render(<OfferCardList {...props} />);

    expect(screen.queryByTestId(/offer-card-/)).not.toBeInTheDocument();
  });

  test('should handle empty offers array in horizontal orientation', () => {
    (getGroupedOffers as Mock).mockReturnValue({});

    const props = {
      ...defaultProps,
      offers: [],
      orientation: 'horizontal' as const,
    };

    render(<OfferCardList {...props} />);

    expect(getGroupedOffers).toHaveBeenCalledWith([]);
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  test('should handle missing callbacks', () => {
    const propsWithoutCallbacks = {
      offers: mockOffers,
      orientation: 'vertical' as const,
    };

    expect(() => {
      render(<OfferCardList {...propsWithoutCallbacks} />);
    }).not.toThrow();

    expect(screen.getAllByTestId(/offer-card-/)).toHaveLength(
      mockOffers.length
    );
  });

  test('should pass correct props to OfferCard', () => {
    render(<OfferCardList {...defaultProps} />);

    expect(OfferCard).toHaveBeenCalledWith(
      expect.objectContaining({
        offer: mockOffers[0],
        orientation: 'vertical',
        onMouseEnter: expect.any(Function) as VoidFunction,
        onMouseLeave: expect.any(Function) as VoidFunction,
        onToggleFavorite: expect.any(Function) as VoidFunction,
      }),
      expect.anything()
    );
  });

  test('should handle Promise from onOfferToggleFavorite', async () => {
    const user = userEvent.setup();
    let resolvePromise: () => void;
    const mockPromise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    const mockOnOfferToggleFavorite = vi.fn(() => mockPromise);

    const props = {
      ...defaultProps,
      onOfferToggleFavorite: mockOnOfferToggleFavorite,
    };

    render(<OfferCardList {...props} />);

    const firstOffer = mockOffers[0];
    const favoriteButton = screen.getByTestId(
      `toggle-favorite-${firstOffer.id}`
    );

    await user.click(favoriteButton);
    resolvePromise!();
    await mockPromise;

    expect(mockOnOfferToggleFavorite).toHaveBeenCalledWith(
      firstOffer,
      !firstOffer.isFavorite
    );
  });

  test('should use default Promise.resolve when onOfferToggleFavorite is not provided', async () => {
    const user = userEvent.setup();

    const propsWithoutCallback = {
      offers: mockOffers,
      orientation: 'vertical' as const,
      onOfferHover: vi.fn(),
    };

    render(<OfferCardList {...propsWithoutCallback} />);

    const firstOffer = mockOffers[0];
    const favoriteButton = screen.getByTestId(
      `toggle-favorite-${firstOffer.id}`
    );

    await expect(user.click(favoriteButton)).resolves.not.toThrow();
  });
});
