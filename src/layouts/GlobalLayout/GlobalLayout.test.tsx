import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, Mock } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { GlobalLayout } from './GlobalLayout';
import { authReducer } from '../../store/reducers/auth';
import { getAuthStatus } from '../../store/selectors';
import * as apiActions from '../../store/api-actions';
import * as redux from 'react-redux';

vi.mock('../../store/selectors', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../store/selectors')>();
  return {
    ...actual,
    getAuthStatus: vi.fn(),
  };
});

vi.mock('../../store/api-actions', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('../../store/api-actions')
  >();
  return {
    ...actual,
    checkAuth: vi.fn(),
    fetchFavorites: vi.fn(),
  };
});

vi.mock('react-redux', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-redux')>();
  return {
    ...actual,
    useSelector: vi.fn(),
    useDispatch: vi.fn(),
  };
});

describe('GlobalLayout component', () => {
  const dispatchMock = vi.fn();
  const mockedUseSelector = redux.useSelector as Mock;
  const mockedUseDispatch = redux.useDispatch as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseDispatch.mockReturnValue(dispatchMock);
  });

  const renderWithStore = (authStatus: 'AUTH' | 'NO_AUTH' | 'UNKNOWN') => {
    mockedUseSelector.mockImplementation((selector) => {
      if (selector === getAuthStatus) {
        return authStatus;
      }
      return null;
    });

    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: { authStatus, authInfo: null },
      },
    });

    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route element={<GlobalLayout />}>
              <Route
                path="/"
                element={<div data-testid="outlet">Outlet Content</div>}
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  test('dispatches checkAuth on mount', () => {
    renderWithStore('UNKNOWN');
    expect(apiActions.checkAuth).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith(apiActions.checkAuth());
  });

  test('dispatches fetchFavorites when authStatus is AUTH', () => {
    renderWithStore('AUTH');
    expect(apiActions.fetchFavorites).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith(apiActions.fetchFavorites());
  });

  test('does not dispatch fetchFavorites when authStatus is NO_AUTH', () => {
    renderWithStore('NO_AUTH');
    expect(apiActions.fetchFavorites).not.toHaveBeenCalled();
  });

  test('renders Outlet content', () => {
    renderWithStore('AUTH');
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
    expect(screen.getByText('Outlet Content')).toBeInTheDocument();
  });
});
