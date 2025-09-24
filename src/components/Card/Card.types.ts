import { type Card } from '../../types';

export type CardProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> &
  Omit<Card, 'id'>;
