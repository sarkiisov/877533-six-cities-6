import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { RouterProvider } from './RouterProvider';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-router-dom', async (): Promise<unknown> => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );
  return {
    ...actual,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="browser-router">{children}</div>
    ),
  };
});

import { Outlet } from 'react-router-dom';

vi.mock('../../layouts/GlobalLayout', () => ({
  GlobalLayout: () => (
    <div data-testid="global-layout">
      <Outlet />
    </div>
  ),
}));

vi.mock('../../layouts/PrivateLayout', () => ({
  PrivateLayout: () => (
    <div data-testid="private-layout">
      <Outlet />
    </div>
  ),
}));

vi.mock('../../layouts/AuthLayout/AuthLayout', () => ({
  AuthLayout: () => (
    <div data-testid="auth-layout">
      <Outlet />
    </div>
  ),
}));

vi.mock('../../pages/Main/Main', () => ({
  Main: () => <div data-testid="main-page">Main Page</div>,
}));

vi.mock('../../pages/NotFound', () => ({
  NotFound: () => <div data-testid="not-found-page">Not Found Page</div>,
}));

vi.mock('../../pages/Login', () => ({
  Login: () => <div data-testid="login-page">Login Page</div>,
}));

vi.mock('../../pages/Favorites', () => ({
  Favorites: () => <div data-testid="favorites-page">Favorites Page</div>,
}));

vi.mock('../../pages/Offer', () => ({
  Offer: () => <div data-testid="offer-page">Offer Page</div>,
}));

const renderWithRouter = (initialRoute = '/') =>
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <RouterProvider />
    </MemoryRouter>
  );

describe('RouterProvider', () => {
  test('should render GlobalLayout wrapper for all routes', () => {
    renderWithRouter('/');

    expect(screen.getByTestId('global-layout')).toBeInTheDocument();
  });

  test('should render Main component on root route "/"', () => {
    renderWithRouter('/');

    expect(screen.getByTestId('global-layout')).toBeInTheDocument();
    expect(screen.getByTestId('main-page')).toBeInTheDocument();
    expect(screen.getByText('Main Page')).toBeInTheDocument();
  });

  test('should render Login component on "/login" route with AuthLayout', () => {
    renderWithRouter('/login');

    expect(screen.getByTestId('global-layout')).toBeInTheDocument();
    expect(screen.getByTestId('auth-layout')).toBeInTheDocument();
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  test('should render Favorites component on "/favorites" route with PrivateLayout', () => {
    renderWithRouter('/favorites');

    expect(screen.getByTestId('global-layout')).toBeInTheDocument();
    expect(screen.getByTestId('private-layout')).toBeInTheDocument();
    expect(screen.getByTestId('favorites-page')).toBeInTheDocument();
    expect(screen.getByText('Favorites Page')).toBeInTheDocument();
  });

  test('should render Offer component on "/offer/:id" dynamic route', () => {
    renderWithRouter('/offer/123');

    expect(screen.getByTestId('global-layout')).toBeInTheDocument();
    expect(screen.getByTestId('offer-page')).toBeInTheDocument();
    expect(screen.getByText('Offer Page')).toBeInTheDocument();
  });

  test('should render NotFound component for unknown routes', () => {
    renderWithRouter('/unknown-route');

    expect(screen.getByTestId('global-layout')).toBeInTheDocument();
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    expect(screen.getByText('Not Found Page')).toBeInTheDocument();
  });

  test('should render NotFound component for nested unknown routes', () => {
    renderWithRouter('/favorites/unknown');

    expect(screen.getByTestId('global-layout')).toBeInTheDocument();
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
  });

  test('should handle multiple dynamic offer IDs', () => {
    const offerIds = ['123', '456', '789', 'abc-def'];

    offerIds.forEach((id) => {
      const { unmount } = renderWithRouter(`/offer/${id}`);

      expect(screen.getByTestId('global-layout')).toBeInTheDocument();
      expect(screen.getByTestId('offer-page')).toBeInTheDocument();

      unmount();
    });
  });
});
