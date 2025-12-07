import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Footer } from './Footer';

describe('Footer component', () => {
  it('contains a link to the homepage', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    const logoLink = screen.getByRole('link', { name: /6 cities logo/i });
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('renders the logo image with correct attributes', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    const logoImage = screen.getByAltText('6 cities logo');
    expect(logoImage).toHaveAttribute('src', 'img/logo.svg');
    expect(logoImage).toHaveAttribute('width', '64');
    expect(logoImage).toHaveAttribute('height', '33');
  });
});
