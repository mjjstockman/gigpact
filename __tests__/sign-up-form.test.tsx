import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SignUpForm } from '../components/sign-up-form'; // Adjust path if needed

// Helper to render, fill inputs, and submit form
const setupAndSubmit = async (username: string, email: string) => {
  const mockOnSubmit = jest.fn();

  render(<SignUpForm onSubmit={mockOnSubmit} />);

  fireEvent.input(screen.getByLabelText(/username/i), {
    target: { value: username }
  });

  fireEvent.input(screen.getByLabelText(/email/i), {
    target: { value: email }
  });

  fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

  return mockOnSubmit;
};

describe('SignUpForm Email Validation', () => {
  it('shows error when email field is empty', async () => {
    const mockOnSubmit = jest.fn();

    render(<SignUpForm onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' }
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
    const mockOnSubmit = jest.fn(() => {
      return Promise.reject(new Error('Email already registered'));
    });

    render(<SignUpForm onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' }
    });

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'already@taken.com' }
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    const errorMessage = await screen.findByTestId('email-taken-error');
    expect(errorMessage).toHaveTextContent('This email is already registered');
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
});
