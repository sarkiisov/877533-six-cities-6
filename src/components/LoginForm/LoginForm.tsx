import { useState } from 'react';
import { LoginFormData, LoginFormProps } from './LoginForm.types';
import clsx from 'clsx';

const fallbackDefaultValues: LoginFormData = {
  email: '',
  password: '',
};

export const LoginForm = ({
  defaultValues,
  onSubmit,
  className,
  ...props
}: LoginFormProps) => {
  const [formData, setFormData] = useState<LoginFormData>(
    defaultValues ?? fallbackDefaultValues
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSubmitDisabled =
    isSubmitting || !formData.email || !formData.password;

  const handleFieldChange = (event: React.ChangeEvent) => {
    const { name, value } = event.target as HTMLInputElement;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (
    event: React.FormEvent,
    data: LoginFormData
  ) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      await onSubmit?.(data);
      setFormData(fallbackDefaultValues);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className={clsx('login__form form', className)}
      onSubmit={(event) => void handleFormSubmit(event, formData)}
      {...props}
    >
      <div className="login__input-wrapper form__input-wrapper">
        <label className="visually-hidden">E-mail</label>
        <input
          className="login__input form__input"
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={(event) => handleFieldChange(event)}
        />
      </div>
      <div className="login__input-wrapper form__input-wrapper">
        <label className="visually-hidden">Password</label>
        <input
          className="login__input form__input"
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={(event) => handleFieldChange(event)}
        />
      </div>
      <button
        className="login__submit form__submit button"
        type="submit"
        disabled={isSubmitDisabled}
      >
        Sign in
      </button>
    </form>
  );
};
