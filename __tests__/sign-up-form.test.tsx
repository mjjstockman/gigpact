import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SignUpForm } from '../components/sign-up-form';

describe('Rendering', () => {
  it('renders username, email, password, confirm password inputs, and register button', () => {
    render(<SignUpForm />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/repeat password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Sign Up/i })
    ).toBeInTheDocument();
  });

  describe('input errors', () => {
    it('shows error when email format is invalid', async () => {
      const mockOnSubmit = jest.fn(); // optionally type this later

      render(<SignUpForm onSubmit={mockOnSubmit} />);

      fireEvent.input(screen.getByLabelText(/username/i), {
        target: { value: 'testuser' }
      });

      fireEvent.input(screen.getByLabelText(/email/i), {
        target: { value: 'invalid-email' }
      });

      fireEvent.input(screen.getByLabelText(/^password$/i), {
        target: { value: 'Password1!' }
      });

      fireEvent.input(screen.getByLabelText(/repeat password/i), {
        target: { value: 'Password1!' }
      });

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });

      expect(
        await screen.findByText(/invalid email format/i)
      ).toBeInTheDocument();
    });
  });
});
