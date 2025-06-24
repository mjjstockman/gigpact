import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SignUpForm } from '../components/sign-up-form';

const setupAndSubmit = async (username: string, email: string) => {
  const mockOnSubmit = jest.fn();

  render(<SignUpForm onSubmit={mockOnSubmit} />);

  fireEvent.input(screen.getByLabelText(/username/i), {
    target: { value: username }
  });

  fireEvent.input(screen.getByLabelText(/email/i), {
    target: { value: email }
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
  });

  return mockOnSubmit;
};

describe('SignUpForm Email Validation', () => {
  it('shows error when email field is empty', async () => {
    const mockOnSubmit = jest.fn();

    render(<SignUpForm onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: 'testUser1' }
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    const errorMessage = await screen.findByTestId('email-error');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(/email is required/i);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error when email format is invalid', async () => {
    const mockOnSubmit = jest.fn();

    render(<SignUpForm onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' }
    });

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' }
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    const errorMessage = await screen.findByTestId('email-error');
    expect(errorMessage).toHaveTextContent(/invalid email format/i);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error when email is already registered', async () => {
    const mockOnSubmit = jest.fn(async () => {
      throw new Error('Email already registered');
    });

    render(<SignUpForm onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: 'testUser1' }
    });

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'already@taken.com' }
    });

    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'Valid123!' }
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    });

    const errorMessage = await screen.findByTestId('email-taken-error');
    expect(errorMessage).toHaveTextContent('This email is already registered');
  });

  it('trims leading and trailing spaces from email before submitting', async () => {
    const mockOnSubmit = jest.fn();

    render(<SignUpForm onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: 'ValidUser1' }
    });

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: '  user@example.com  ' }
    });

    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'ValidPass123!' }
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    });

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'user@example.com',
        username: 'ValidUser1',
        password: 'ValidPass123!'
      })
    );
  });
});

describe('SignUpForm Username Validation', () => {
  it('shows error when username field is empty', async () => {
    const mockOnSubmit = await setupAndSubmit('', 'test@email.com');

    const errorMessage = await screen.findByTestId('username-error');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(/username is required/i);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error when username is less than 3 characters', async () => {
    const mockOnSubmit = await setupAndSubmit('ab', 'test@email.com');

    const errorMessage = await screen.findByTestId('username-error');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(/at least 3 characters/i);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error when username is too long', async () => {
    const mockOnSubmit = jest.fn();

    render(<SignUpForm onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: 'A'.repeat(21) }
    });

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    const errorMessage = await screen.findByTestId('username-error');
    expect(errorMessage).toHaveTextContent(
      /username must be at most 20 characters/i
    );
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error when username contains spaces or invalid symbols like "!"', async () => {
    const mockOnSubmit = jest.fn();

    render(<SignUpForm onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: 'invalid user!' }
    });

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    const errorMessage = await screen.findByTestId('username-error');
    expect(errorMessage).toHaveTextContent(
      /username can only contain letters, numbers, underscores, and hyphens/i
    );

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error when username is already taken', async () => {
    const mockOnSubmit = jest.fn(async () => {
      throw new Error('Username already taken');
    });

    render(<SignUpForm onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: 'takenUser1' }
    });

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });

    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'ValidPass123!' }
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    });

    const errorMessage = await screen.findByTestId('username-taken-error');
    expect(errorMessage).toHaveTextContent('This username is already taken');
  });

  it('shows error when username does not contain any uppercase letters', async () => {
    const mockOnSubmit = await setupAndSubmit(
      'alllowercase',
      'test@example.com'
    );

    const errorMessage = await screen.findByTestId('username-error');
    expect(errorMessage).toHaveTextContent(
      /must contain at least one uppercase letter/i
    );
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error when username does not contain any lowercase letters', async () => {
    const mockOnSubmit = await setupAndSubmit(
      'ALLUPPERCASE',
      'test@example.com'
    );

    const errorMessage = await screen.findByTestId('username-error');
    expect(errorMessage).toHaveTextContent(
      /must contain at least one lowercase letter/i
    );
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error when username does not contain any numbers', async () => {
    const mockOnSubmit = await setupAndSubmit(
      'NoNumbersHere',
      'test@example.com'
    );

    const errorMessage = await screen.findByTestId('username-error');
    expect(errorMessage).toHaveTextContent(/must contain at least one number/i);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('trims leading and trailing spaces from username before submitting', async () => {
    const mockOnSubmit = jest.fn();

    render(<SignUpForm onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: '  TrimUser1  ' }
    });

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' }
    });

    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'ValidPass123!' }
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    });

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'TrimUser1',
        email: 'user@example.com',
        password: 'ValidPass123!'
      })
    );
  });
});

describe('SignUpForm Password Validation', () => {
  it('shows error when password field is empty', async () => {
    const mockOnSubmit = jest.fn();

    render(<SignUpForm onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: 'ValidUser1' }
    });
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'valid@example.com' }
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    const errorMessage = await screen.findByTestId('password-error');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(/password is required/i);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error when password is less than 8 characters', async () => {
    const mockOnSubmit = jest.fn();

    render(<SignUpForm onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: 'ValidUser1' }
    });

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' }
    });

    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'short!' }
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    });

    const errorMessage = await screen.findByTestId('password-error');
    expect(errorMessage).toHaveTextContent(/at least 8 characters/i);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error when password is more than 128 characters', async () => {
    const mockOnSubmit = jest.fn();

    render(<SignUpForm onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: 'ValidUser1' }
    });

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' }
    });

    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'a'.repeat(128) + '!' }
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    });

    const errorMessage = await screen.findByTestId('password-error');
    expect(errorMessage).toHaveTextContent(/at most 128 characters/i);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error when password does not contain a special character', async () => {
    const mockOnSubmit = jest.fn();

    render(<SignUpForm onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: 'ValidUser1' }
    });

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' }
    });

    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'Password123' }
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    });

    const errorMessage = await screen.findByTestId('password-error');
    expect(errorMessage).toHaveTextContent(/at least one special character/i);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
