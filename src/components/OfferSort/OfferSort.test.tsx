import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { OfferSort } from './OfferSort';
import { OfferSortProps } from './OfferSort.types';
import { OFFER_SORT_OPTIONS } from '../../utils/consts';

vi.mock('../../hooks/useClickOutside', () => ({
  useClickOutside: vi.fn(),
}));

describe('OfferSort component', () => {
  const mockOptions = OFFER_SORT_OPTIONS;

  type SortOption = (typeof mockOptions)[number]['value'];

  const defaultProps: OfferSortProps<SortOption> = {
    options: mockOptions,
    value: 'popular',
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render correctly with default props', () => {
    render(<OfferSort {...defaultProps} />);

    const sortContainer = screen
      .getByText('Sort by')
      .closest('.places__sorting');
    expect(sortContainer).toBeInTheDocument();

    expect(screen.getByText('Sort by')).toBeInTheDocument();
    expect(screen.getByText('Sort by')).toHaveClass('places__sorting-caption');

    expect(screen.getByText('Popular')).toBeInTheDocument();
    expect(screen.getByText('Popular')).toHaveClass('places__sorting-type');

    const svgElement = screen.getByRole('img', { hidden: true });
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveClass('places__sorting-arrow');
    expect(svgElement).toHaveAttribute('width', '7');
    expect(svgElement).toHaveAttribute('height', '4');

    const useElement = svgElement.querySelector('use');
    expect(useElement).toHaveAttribute('xlink:href', '#icon-arrow-select');

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  test('should display current selected option', () => {
    const props = {
      ...defaultProps,
      value: 'price:low-to-high' as SortOption,
    };

    render(<OfferSort {...props} />);

    expect(screen.getByText('Price: low to high')).toBeInTheDocument();
    expect(screen.queryByText('Popular')).not.toBeInTheDocument();
  });

  test('should display options in correct order when opened', async () => {
    const user = userEvent.setup();
    render(<OfferSort {...defaultProps} />);

    const sortContainer = screen
      .getByText('Sort by')
      .closest('.places__sorting');
    await user.click(sortContainer!);

    const displayedOptions = screen
      .getAllByRole('listitem')
      .map((item) => item.textContent);

    const expectedOptions = mockOptions.map((option) => option.label);
    expect(displayedOptions).toEqual(expectedOptions);
  });

  test('should toggle dropdown on click', async () => {
    const user = userEvent.setup();

    render(<OfferSort {...defaultProps} />);

    const sortContainer = screen
      .getByText('Sort by')
      .closest('.places__sorting');

    await user.click(sortContainer!);
    expect(screen.getByRole('list')).toBeInTheDocument();

    await user.click(sortContainer!);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  test('should close dropdown when option is selected', async () => {
    const user = userEvent.setup();

    render(<OfferSort {...defaultProps} />);

    const sortContainer = screen
      .getByText('Sort by')
      .closest('.places__sorting');
    await user.click(sortContainer!);

    const option = screen.getByText('Price: low to high');
    await user.click(option);

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  test('should toggle dropdown on multiple clicks', async () => {
    const user = userEvent.setup();
    render(<OfferSort {...defaultProps} />);

    const sortContainer = screen
      .getByText('Sort by')
      .closest('.places__sorting');

    await user.click(sortContainer!);
    expect(screen.getByRole('list')).toBeInTheDocument();

    await user.click(sortContainer!);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();

    await user.click(sortContainer!);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  test('should handle keyboard navigation with tab', async () => {
    const user = userEvent.setup();
    render(<OfferSort {...defaultProps} />);

    const sortTypeElement = screen.getByText('Popular');

    expect(sortTypeElement).toHaveAttribute('tabIndex', '0');

    await user.tab();
    expect(sortTypeElement).toHaveFocus();
  });

  test('should apply correct CSS classes to options', async () => {
    const user = userEvent.setup();
    render(<OfferSort {...defaultProps} />);

    const sortContainer = screen
      .getByText('Sort by')
      .closest('.places__sorting');
    await user.click(sortContainer!);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(mockOptions.length);

    listItems.forEach((item) => {
      expect(item).toHaveClass('places__option');
      expect(item).toHaveClass('places__option--active');
      expect(item).toHaveAttribute('tabIndex', '0');
    });
  });

  test('should work without onChange callback', async () => {
    const user = userEvent.setup();
    const propsWithoutOnChange = {
      options: mockOptions,
      value: 'popular' as SortOption,
    };

    render(<OfferSort {...propsWithoutOnChange} />);

    const sortContainer = screen
      .getByText('Sort by')
      .closest('.places__sorting');
    await user.click(sortContainer!);

    const option = screen.getByText('Top rated first');
    await expect(user.click(option)).resolves.not.toThrow();
  });

  test('should handle different option types', () => {
    type CustomOption = 'opt1' | 'opt2' | 'opt3';
    const customOptions = [
      { label: 'Option 1', value: 'opt1' as CustomOption },
      { label: 'Option 2', value: 'opt2' as CustomOption },
      { label: 'Option 3', value: 'opt3' as CustomOption },
    ];

    const props: OfferSortProps<CustomOption> = {
      options: customOptions,
      value: 'opt2',
      onChange: vi.fn(),
    };

    render(<OfferSort {...props} />);

    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });
});
