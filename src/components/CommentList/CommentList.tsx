import { Comment } from '../Comment/Comment';
import { CommentListProps } from './CommentList.types';

export const CommentList = ({ comments }: CommentListProps) => (
  <>
    <h2 className="reviews__title">
      Reviews &middot;{' '}
      <span className="reviews__amount">{comments.length}</span>
    </h2>
    <ul className="reviews__list">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </ul>
  </>
);
