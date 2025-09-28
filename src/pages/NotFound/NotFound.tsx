import { Link } from 'react-router-dom';

export const NotFound = () => (
  <div>
    <h2>
      The page you&apos;re looking for doesn&apos;t exist or has been moved.
    </h2>
    <Link to="/">Go to main page</Link>
  </div>
);
