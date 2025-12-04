export type CommentFormData = {
  rating: number;
  comment: string;
};

export type CommentFormProps = Omit<
  React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  >,
  'onSubmit'
> & {
  defaultValues?: CommentFormData;
  onSubmit?: (data: CommentFormData) => void | Promise<void>;
};
