import { Link } from 'react-router-dom';
import { NotFoundProps } from './NotFound.types';
import classes from './NotFound.module.css';
import clsx from 'clsx';

export const NotFound = ({ className, ...props}: NotFoundProps) => (
  <div className={clsx(classes['not-found'], className)} {...props}>
    <h2>
      The page you&apos;re looking for doesn&apos;t exist or has been moved.
    </h2>
    <Link to="/">Go to main page</Link>
  </div>
);
