import { render, screen } from '@testing-library/react';
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
});
