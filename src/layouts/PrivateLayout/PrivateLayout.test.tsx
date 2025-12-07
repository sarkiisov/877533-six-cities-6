import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, Mock } from 'vitest';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { PrivateLayout } from './PrivateLayout';
import { authReducer } from '../../store/reducers/auth';
import { AuthStatus } from '../../types';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useLocation: vi.fn(),
  };
});

describe('PrivateLayout component', () => {
  const mockedUseLocation = useLocation as Mock;

  const ProtectedPage = () => (
    <div data-testid="protected-content">Protected Content</div>
  );
  const LoginPage = () => <div data-testid="login-page">Login Page</div>;

  const renderWithStore = (
    authStatus: AuthStatus,
    initialRoute = '/protected'
  ) => {
    mockedUseLocation.mockReturnValue({
      pathname: initialRoute,
      search: '',
      hash: '',
      state: null,
    });

    const store = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          authStatus: authStatus,
          authInfo: null,
        },
      },
    });

    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Routes>
            <Route element={<PrivateLayout />}>
              <Route path="/protected" element={<ProtectedPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  test('should render null when auth status is UNKNOWN', () => {
    const { container } = renderWithStore('UNKNOWN');

    expect(container.firstChild).toBeNull();
  });

  test('should render Outlet when auth status is AUTH', () => {
    renderWithStore('AUTH');

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('should redirect to login page when auth status is NO_AUTH', () => {
    renderWithStore('NO_AUTH');

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });
});
