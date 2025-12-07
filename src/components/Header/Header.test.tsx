import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

const mockDispatch = vi.fn();
const mockUseSelector = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-redux', async () => {
  const actual = await vi.importActual<typeof import('react-redux')>(
    'react-redux'
  );
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (selector: unknown): unknown => mockUseSelector(selector),
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { logout } from '../../store/api-actions';
vi.mock('../../store/api-actions', () => ({
  logout: vi.fn(),
}));

import { getAuthStatus, getAuthInfo } from '../../store/selectors';
import { getFavoritesCount } from '../../store/selectors/favorites';

vi.mock('../../store/selectors');
vi.mock('../../store/selectors/favorites');

const mockedGetAuthStatus = vi.mocked(getAuthStatus);
const mockedGetAuthInfo = vi.mocked(getAuthInfo);
const mockedGetFavoritesCount = vi.mocked(getFavoritesCount);

import { Header } from './Header';
import { AnyAction, Store } from '@reduxjs/toolkit';

const fakeStore = {
  getState: () => ({}),
  dispatch: mockDispatch,
  subscribe: () => () => {},
};

const renderHeader = () =>
  render(
    <Provider store={fakeStore as unknown as Store<object, AnyAction>}>
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    </Provider>
  );

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Header', () => {
  it('renders Sign in when NO_AUTH', () => {
    mockedGetAuthStatus.mockReturnValue('NO_AUTH');
    mockedGetAuthInfo.mockReturnValue(null);
    mockedGetFavoritesCount.mockReturnValue(0);

    mockUseSelector.mockImplementation((fn: VoidFunction) => fn());

    renderHeader();

    expect(screen.getByText('Sign in')).toBeVisible();
  });

  it('renders avatar, email and favorites when AUTH', () => {
    mockedGetAuthStatus.mockReturnValue('AUTH');
    mockedGetAuthInfo.mockReturnValue({
      name: 'John Doe',
      avatarUrl: '/avatar.png',
      isPro: false,
      email: 'john@example.com',
      token: '',
    });
    mockedGetFavoritesCount.mockReturnValue(5);

    mockUseSelector.mockImplementation((fn: VoidFunction) => fn());

    renderHeader();

    expect(screen.getByText('john@example.com')).toBeVisible();
    expect(screen.getByText('5')).toBeVisible();

    const avatar = document.querySelector('.header__avatar-wrapper img');
    expect(avatar).not.toBeNull();
    expect(avatar?.getAttribute('src')).toBe('/avatar.png');
  });

  it('renders nothing for UNKNOWN', () => {
    mockedGetAuthStatus.mockReturnValue('UNKNOWN');
    mockedGetAuthInfo.mockReturnValue(null);
    mockedGetFavoritesCount.mockReturnValue(0);

    mockUseSelector.mockImplementation((fn: VoidFunction) => fn());

    renderHeader();

    expect(screen.queryByText('Sign in')).toBeNull();
    expect(screen.queryByText('Sign out')).toBeNull();
  });

  it('navigates to login on Sign in click', () => {
    mockedGetAuthStatus.mockReturnValue('NO_AUTH');
    mockedGetAuthInfo.mockReturnValue(null);
    mockedGetFavoritesCount.mockReturnValue(0);

    mockUseSelector.mockImplementation((fn: VoidFunction) => fn());

    renderHeader();

    fireEvent.click(screen.getByText('Sign in'));

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('dispatches logout and navigates to login on Sign out click', () => {
    mockedGetAuthStatus.mockReturnValue('AUTH');
    mockedGetAuthInfo.mockReturnValue({
      name: 'John Doe',
      avatarUrl: '/avatar.png',
      isPro: false,
      email: 'john@example.com',
      token: '',
    });
    mockedGetFavoritesCount.mockReturnValue(3);

    mockUseSelector.mockImplementation((fn: VoidFunction) => fn());

    renderHeader();

    fireEvent.click(screen.getByText('Sign out'));

    expect(logout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
