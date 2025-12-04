import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '../../store';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/api-actions';
import { memo } from 'react';
import { getAuthInfo, getAuthStatus } from '../../store/selectors';

export const Header = memo(() => {
  const dispatch = useDispatch<Dispatch>();

  const authStatus = useSelector(getAuthStatus);
  const authInfo = useSelector(getAuthInfo);

  const navigate = useNavigate();

  const handleSignOutClick = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSignInClick = () => {
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Link
              to="/"
              className="header__logo-link header__logo-link--active"
            >
              <img
                className="header__logo"
                src="img/logo.svg"
                alt="6 cities logo"
                width="81"
                height="41"
              />
            </Link>
          </div>
          <nav className="header__nav">
            <ul className="header__nav-list">
              {authStatus === 'AUTH' && (
                <li className="header__nav-item user">
                  <Link
                    className="header__nav-link header__nav-link--profile"
                    to="/favorites"
                  >
                    <div className="header__avatar-wrapper user__avatar-wrapper">
                      <img src={authInfo?.avatarUrl} />
                    </div>
                    <span className="header__user-name user__name">
                      {authInfo?.email}
                    </span>
                    <span className="header__favorite-count">3</span>
                  </Link>
                </li>
              )}
              {
                {
                  UNKNOWN: null,
                  AUTH: (
                    <li className="header__nav-item">
                      <a
                        className="header__nav-link"
                        onClick={handleSignOutClick}
                      >
                        <span className="header__signout">Sign out</span>
                      </a>
                    </li>
                  ),
                  NO_AUTH: (
                    <li className="header__nav-item user">
                      <a
                        className="header__nav-link header__nav-link--profile"
                        onClick={handleSignInClick}
                      >
                        <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                        <span className="header__login">Sign in</span>
                      </a>
                    </li>
                  ),
                }[authStatus]
              }
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
