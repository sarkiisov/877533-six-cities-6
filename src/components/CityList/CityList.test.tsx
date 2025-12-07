import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CityList } from './CityList';
import { makeFakeCities } from '../../utils/mocks';

describe('CityList component', () => {
  const cities = makeFakeCities(3);

  const onCityChange = vi.fn();

  it('renders all cities', () => {
    render(
      <CityList
        cities={cities}
        onCityChange={onCityChange}
        activeCity={cities[0]}
      />
    );
    cities.forEach((city) => {
      expect(screen.getByText(city.name)).toBeInTheDocument();
    });
  });

  it('calls onCityChange when a city is clicked', () => {
    render(
      <CityList
        cities={cities}
        onCityChange={onCityChange}
        activeCity={cities[0]}
      />
    );
    const cityLink = screen.getByText(cities[0].name);
    fireEvent.click(cityLink);
    expect(onCityChange).toHaveBeenCalledTimes(1);
    expect(onCityChange).toHaveBeenCalledWith(cities[0]);
  });

  it('applies active class to the active city', () => {
    render(
      <CityList
        cities={cities}
        onCityChange={onCityChange}
        activeCity={cities[0]}
      />
    );
    const activeCityLink = screen.getByText(cities[0].name).closest('a');
    const inactiveCityLink = screen.getByText(cities[1].name).closest('a');

    expect(activeCityLink).toHaveClass('tabs__item--active');
    expect(inactiveCityLink).not.toHaveClass('tabs__item--active');
  });

  it('renders empty list when no cities are provided', () => {
    render(<CityList cities={[]} onCityChange={onCityChange} />);
    const listItems = screen.queryAllByRole('listitem');
    expect(listItems).toHaveLength(0);
  });
});
