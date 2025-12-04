import { Link, useNavigate } from 'react-router-dom';
import { Dispatch } from '../../store';
import { useDispatch } from 'react-redux';
import { LoginForm, LoginFormData } from '../../components/LoginForm';
import { login } from '../../store/api-actions';

export const Login = () => {
  const dispatch = useDispatch<Dispatch>();

  const navigate = useNavigate();

  const handleFormSubmit = async (data: LoginFormData) => {
    await dispatch(login(data));
    navigate('/');
  };

  return (
    <div className="page page--gray page--login">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link className="header__logo-link" to="/">
                <img
                  className="header__logo"
                  src="img/logo.svg"
                  alt="6 cities logo"
                  width="81"
                  height="41"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <LoginForm onSubmit={handleFormSubmit} />
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <Link className="locations__item-link" to="/">
                <span>Amsterdam</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
