import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CommentList } from './CommentList';
import { makeFakeComments } from '../../utils/mocks';
import { Comment } from '../../types';

vi.mock('../Comment/Comment', () => ({
  Comment: ({ comment }: { comment: Comment }) => (
    <div data-testid="comment">{comment.comment}</div>
  ),
}));

describe('CommentList component', () => {
  const comments = makeFakeComments(3);

  it('renders the reviews title with the correct number of comments', () => {
    render(<CommentList comments={comments} />);
    const title = screen.getByText(/Reviews ·/i);
    expect(title).toBeInTheDocument();

    const amount = screen.getByText(String(comments.length));
    expect(amount).toBeInTheDocument();
  });

  it('renders a list of Comment components', () => {
    render(<CommentList comments={comments} />);
    const renderedComments = screen.getAllByTestId('comment');
    expect(renderedComments).toHaveLength(comments.length);
    expect(renderedComments[0]).toHaveTextContent(comments[0].comment);
    expect(renderedComments[1]).toHaveTextContent(comments[1].comment);
  });

  it('renders an empty list when there are no comments', () => {
    render(<CommentList comments={[]} />);
    const renderedComments = screen.queryAllByTestId('comment');
    expect(renderedComments).toHaveLength(0);
    const amount = screen.getByText('0');
    expect(amount).toBeInTheDocument();
  });
});
