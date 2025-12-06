import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { OfferEmpty } from './OfferEmpty';
import { OfferEmptyProps } from './OfferEmpty.types';
import { makeFakeCity } from '../../utils/mocks';

describe('OfferEmpty component', () => {
  const mockCity = makeFakeCity();

  const defaultProps: OfferEmptyProps = {
    city: mockCity,
  };

  test('should render correctly with default props', () => {
    render(<OfferEmpty {...defaultProps} />);

    expect(screen.getByText('No places to stay available')).toBeInTheDocument();
    expect(
      screen.getByText(
        `We could not find any property available at the moment in ${mockCity.name}`
      )
    ).toBeInTheDocument();

    const container = screen
      .getByText('No places to stay available')
      .closest('.cities__places-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('cities__places-container');
    expect(container).toHaveClass('cities__places-container--empty');
    expect(container).toHaveClass('container');
  });

  test('should display correct city name', () => {
    render(<OfferEmpty city={mockCity} />);

    expect(
      screen.getByText(
        `We could not find any property available at the moment in ${mockCity.name}`
      )
    ).toBeInTheDocument();
  });

  test('should apply custom className', () => {
    const customClassName = 'custom-class';

    render(<OfferEmpty {...defaultProps} className={customClassName} />);

    const container = screen
      .getByText('No places to stay available')
      .closest('.cities__places-container');
    expect(container).toHaveClass(customClassName);
    expect(container).toHaveClass('cities__places-container');
    expect(container).toHaveClass('cities__places-container--empty');
    expect(container).toHaveClass('container');
  });

  test('should pass additional HTML attributes', () => {
    const propsWithAttributes: OfferEmptyProps = {
      city: mockCity,
      id: 'empty-offers',
      style: { backgroundColor: 'red' },
    };

    render(<OfferEmpty {...propsWithAttributes} />);

    const container = screen
      .getByText('No places to stay available')
      .closest('.cities__places-container');
    expect(container).toHaveAttribute('id', 'empty-offers');
  });

  test('should have correct HTML structure', () => {
    const { container } = render(<OfferEmpty {...defaultProps} />);

    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer.tagName).toBe('DIV');
    expect(mainContainer.className).toContain('cities__places-container');

    const noPlacesSection = mainContainer.querySelector('.cities__no-places');
    expect(noPlacesSection).toBeInTheDocument();

    const rightSection = mainContainer.querySelector('.cities__right-section');
    expect(rightSection).toBeInTheDocument();
  });

  test('should render status wrapper with correct classes', () => {
    render(<OfferEmpty {...defaultProps} />);

    const statusWrapper = screen.getByText(
      'No places to stay available'
    ).parentElement;
    expect(statusWrapper).toHaveClass('cities__status-wrapper');
    expect(statusWrapper).toHaveClass('tabs__content');
  });

  test('should render bold status text', () => {
    render(<OfferEmpty {...defaultProps} />);

    const statusText = screen.getByText('No places to stay available');
    expect(statusText.tagName).toBe('B');
    expect(statusText).toHaveClass('cities__status');
  });

  test('should render description paragraph', () => {
    render(<OfferEmpty {...defaultProps} />);

    const description = screen.getByText(
      `We could not find any property available at the moment in ${mockCity.name}`
    );
    expect(description.tagName).toBe('P');
    expect(description).toHaveClass('cities__status-description');
  });
});
