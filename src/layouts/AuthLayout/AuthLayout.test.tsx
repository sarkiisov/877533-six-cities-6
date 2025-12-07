import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { AuthLayout } from './AuthLayout';
import { authReducer } from '../../store/reducers/auth';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    Navigate: ({
      to,
      state,
      replace,
    }: {
      to: string;
      state?: unknown;
      replace?: boolean;
    }) => (
      <div
        data-testid="navigate-component"
        data-to={to}
        data-replace={replace?.toString()}
        data-state={JSON.stringify(state)}
      >
        Redirecting to {to}
      </div>
    ),
  };
});

describe('AuthLayout component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithStore = (
    authStatus: 'AUTH' | 'NO_AUTH' | 'UNKNOWN',
    initialEntry = '/current'
  ) => {
    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: {
          authStatus,
          authInfo:
            authStatus === 'AUTH'
              ? {
                name: 'John Doe',
                avatarUrl: '/avatar.png',
                isPro: false,
                email: 'john@example.com',
                token: '',
              }
              : null,
        },
      },
    });

    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route
                path="/current"
                element={<div data-testid="outlet-content">Outlet Content</div>}
              />
            </Route>
            <Route
              path="/"
              element={<div data-testid="home-page">Home Page</div>}
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  test('renders Navigate when authStatus is AUTH', () => {
    renderWithStore('AUTH', '/current');

    const navigateComponent = screen.getByTestId('navigate-component');
    expect(navigateComponent).toBeInTheDocument();
    expect(navigateComponent).toHaveAttribute('data-to', '/');
    expect(navigateComponent).toHaveAttribute('data-replace', 'true');

    expect(screen.queryByTestId('outlet-content')).not.toBeInTheDocument();
  });

  test('renders Outlet when authStatus is NO_AUTH', () => {
    renderWithStore('NO_AUTH', '/current');

    expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
    expect(screen.getByText('Outlet Content')).toBeInTheDocument();

    expect(screen.queryByTestId('navigate-component')).not.toBeInTheDocument();
  });

  test('renders nothing when authStatus is UNKNOWN', () => {
    const { container } = renderWithStore('UNKNOWN', '/current');

    expect(container.firstChild).toBeNull();

    expect(screen.queryByTestId('outlet-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('navigate-component')).not.toBeInTheDocument();
  });
});
