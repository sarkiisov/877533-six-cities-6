import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';
import { LoginFormProps } from './LoginForm.types';

describe('LoginForm component', () => {
  const defaultProps: LoginFormProps = {
    onSubmit: vi.fn(),
  };

  test('should render correctly with default props', () => {
    render(<LoginForm {...defaultProps} />);

    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByRole('form')).toHaveClass('login__form');
    expect(screen.getByRole('form')).toHaveClass('form');

    const emailInput = screen.getByPlaceholderText('Email');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('name', 'email');
    expect(emailInput).toHaveAttribute('required');
    expect(emailInput).toHaveClass('login__input');
    expect(emailInput).toHaveClass('form__input');

    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('name', 'password');
    expect(passwordInput).toHaveAttribute('required');
    expect(passwordInput).toHaveClass('login__input');
    expect(passwordInput).toHaveClass('form__input');

    const submitButton = screen.getByRole('button', { name: 'Sign in' });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
    expect(submitButton).toHaveClass('login__submit');
    expect(submitButton).toHaveClass('form__submit');
    expect(submitButton).toHaveClass('button');

    expect(submitButton).toBeDisabled();
  });

  test('should render with default values', () => {
    const defaultValues = {
      email: 'test@example.com',
      password: 'password123',
    };

    render(<LoginForm {...defaultProps} defaultValues={defaultValues} />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    expect((emailInput as HTMLInputElement).value).toBe('test@example.com');
    expect((passwordInput as HTMLInputElement).value).toBe('password123');

    const submitButton = screen.getByRole('button', { name: 'Sign in' });
    expect(submitButton).not.toBeDisabled();
  });

  test('should apply custom className', () => {
    const customClassName = 'custom-form-class';

    render(<LoginForm {...defaultProps} className={customClassName} />);

    const form = screen.getByRole('form');
    expect(form).toHaveClass('login__form');
    expect(form).toHaveClass('form');
    expect(form).toHaveClass(customClassName);
  });

  test('should pass additional HTML attributes', () => {
    const propsWithAttributes: LoginFormProps = {
      ...defaultProps,
      id: 'login-form',
      style: { maxWidth: '400px' },
    };

    render(<LoginForm {...propsWithAttributes} />);

    const form = screen.getByRole('form');
    expect(form).toHaveAttribute('id', 'login-form');
    expect(form).toHaveStyle('max-width: 400px');
  });

  test('should have visually hidden labels for accessibility', () => {
    render(<LoginForm {...defaultProps} />);

    const emailLabel = screen.getByText('E-mail');
    expect(emailLabel).toBeInTheDocument();
    expect(emailLabel).toHaveClass('visually-hidden');

    const passwordLabel = screen.getByText('Password');
    expect(passwordLabel).toBeInTheDocument();
    expect(passwordLabel).toHaveClass('visually-hidden');
  });

  test('should update input values on change', async () => {
    const user = userEvent.setup();
    render(<LoginForm {...defaultProps} />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'mypassword');

    expect((emailInput as HTMLInputElement).value).toBe('user@example.com');
    expect((passwordInput as HTMLInputElement).value).toBe('mypassword');
  });

  test('should enable submit button when form is valid', async () => {
    const user = userEvent.setup();
    render(<LoginForm {...defaultProps} />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    expect(submitButton).toBeDisabled();

    await user.type(emailInput, 'test@example.com');
    expect(submitButton).toBeDisabled();

    await user.type(passwordInput, 'password');
    expect(submitButton).not.toBeDisabled();
  });

  test('should call onSubmit with form data', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    render(<LoginForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  test('should reset form after successful submission', async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<LoginForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await vi.waitFor(() => {
      expect((emailInput as HTMLInputElement).value).toBe('');
      expect((passwordInput as HTMLInputElement).value).toBe('');
    });
  });

  test('should not reset form on submit error', async () => {
    const mockOnSubmit = vi.fn().mockRejectedValue(new Error('Network error'));
    const user = userEvent.setup();

    render(<LoginForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    await user.click(submitButton);

    expect((emailInput as HTMLInputElement).value).toBe('test@example.com');
    expect((passwordInput as HTMLInputElement).value).toBe('password123');
  });
});
