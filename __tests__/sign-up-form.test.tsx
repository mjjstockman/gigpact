import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SignUpForm } from '../components/sign-up-form'; // Make sure this matches your file path

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
    const mockOnSubmit = jest.fn();

    render(<SignUpForm onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'test@email.com' }
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    const errorMessage = await screen.findByTestId('username-error');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(/username is required/i);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
