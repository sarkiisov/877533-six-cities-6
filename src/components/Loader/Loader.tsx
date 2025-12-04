import Logo from '/img/logo.svg';
import classes from './Loader.module.css';
import { LoaderProps } from './Loader.types';
import clsx from 'clsx';

export const Loader = ({ className, ...props}: LoaderProps) => (
  <div className={clsx(classes.loader, className)} {...props}>
    <img src={Logo} />
    <p>Загрузка...</p>
  </div>
);
