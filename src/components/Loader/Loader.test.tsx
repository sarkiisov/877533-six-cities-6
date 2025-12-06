import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { Loader } from './Loader';

vi.mock('./Loader.module.css', () => ({
  default: {
    loader: 'loader-class',
  },
}));

vi.mock('/img/logo.svg', () => ({
  default: 'mocked-logo.svg',
}));

describe('Loader component', () => {
  test('should render correctly with default props', () => {
    render(<Loader />);

    const container = screen.getByText('Загрузка...').parentElement;
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('loader-class');

    const logo = screen.getByRole('img');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'mocked-logo.svg');

    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });

  test('should apply custom className', () => {
    const customClassName = 'custom-loader-class';

    render(<Loader className={customClassName} />);

    const container = screen.getByText('Загрузка...').parentElement;
    expect(container).toHaveClass('loader-class');
    expect(container).toHaveClass(customClassName);
  });

  test('should pass additional HTML attributes', () => {
    const props = {
      id: 'loader-id',
      'data-testid': 'loader-component',
    };

    render(<Loader {...props} />);

    const container = screen.getByText('Загрузка...').parentElement;
    expect(container).toHaveAttribute('id', 'loader-id');
    expect(container).toHaveAttribute('data-testid', 'loader-component');
  });

  test('should have correct HTML structure', () => {
    const { container } = render(<Loader />);

    const loaderDiv = container.firstChild as HTMLElement;
    expect(loaderDiv.tagName).toBe('DIV');

    const img = loaderDiv.querySelector('img');
    expect(img).toBeInTheDocument();

    const paragraph = loaderDiv.querySelector('p');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph?.textContent).toBe('Загрузка...');
  });

  test('should apply multiple custom classes', () => {
    const multipleClasses = 'class1 class2 class3';

    render(<Loader className={multipleClasses} />);

    const container = screen.getByText('Загрузка...').parentElement;
    expect(container).toHaveClass('loader-class');
    expect(container).toHaveClass('class1');
    expect(container).toHaveClass('class2');
    expect(container).toHaveClass('class3');
  });
});
