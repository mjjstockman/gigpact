import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SignUpForm } from '../components/sign-up-form';

describe('SignUpForm Email Validation', () => {
  it('shows error when email format is invalid', async () => {
    const mockOnSubmit = jest.fn();

    render(<SignUpForm onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' }
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });
});
