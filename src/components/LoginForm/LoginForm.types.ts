export type LoginFormData = {
  email: string;
  password: string;
};

export type LoginFormProps = Omit<
  React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  >,
  'onSubmit'
> & {
  defaultValues?: LoginFormData;
  onSubmit: (data: LoginFormData) => void | Promise<void>;
};
