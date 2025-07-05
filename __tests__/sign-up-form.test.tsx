import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { SignUpForm } from '../components/sign-up-form';

expect.extend(toHaveNoViolations);

const fillForm = ({
  username = 'ValidUser1',
  email = 'user@example.com',
  password = 'ValidPass123!',
  confirmPassword = 'ValidPass123!'
} = {}) => {
  fireEvent.input(screen.getByLabelText(/username/i), {
    target: { value: username }
  });
  fireEvent.input(screen.getByLabelText(/email/i), {
    target: { value: email }
  });
  fireEvent.input(screen.getByLabelText(/^password$/i), {
    target: { value: password }
  });
  fireEvent.input(screen.getByLabelText(/confirm password/i), {
    target: { value: confirmPassword }
  });
};

const submitForm = async () => {
  fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
  await waitFor(() => {});
};

describe('SignUpForm Email Validation', () => {
  let mockOnSubmit: jest.Mock;

  beforeEach(() => {
    mockOnSubmit = jest.fn();
    render(<SignUpForm onSubmit={mockOnSubmit} />);
  });

  afterEach(() => {
    cleanup();
  });

  test.each([
    {
      email: '',
      errorTestId: 'email-error',
      errorText: /email is required/i,
      description: 'empty email'
    },
    {
      email: 'invalid-email',
      errorTestId: 'email-error',
      errorText: /invalid email format/i,
      description: 'invalid email format'
    }
  ])(
    'shows error when $description',
    async ({ email, errorTestId, errorText }) => {
      fillForm({ email });
      await submitForm();

      const errorMessage = await screen.findByTestId(errorTestId);
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent(errorText);
      expect(mockOnSubmit).not.toHaveBeenCalled();
    }
  );

  it('shows error when email is already registered', async () => {
    cleanup();
    const takenEmailSubmit = jest.fn(async () => {
      throw new Error('Email already registered');
    });

    render(<SignUpForm onSubmit={takenEmailSubmit} />);
    fillForm({ email: 'user@example.com' });
    await submitForm();

    const errorMessage = await screen.findByTestId('email-taken-error');
    expect(errorMessage).toHaveTextContent('This email is already registered');
  });

  it('trims leading and trailing spaces from email before submitting', async () => {
    cleanup();
    const trimSubmit = jest.fn();

    render(<SignUpForm onSubmit={trimSubmit} />);
    fillForm({ email: '  user@example.com  ' });
    await submitForm();

    expect(trimSubmit).toHaveBeenCalledTimes(1);
    expect(trimSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'user@example.com',
        username: 'ValidUser1',
        password: 'ValidPass123!'
      })
    );
  });
});

describe('SignUpForm Username Validation', () => {
  let mockOnSubmit: jest.Mock;

  beforeEach(() => {
    mockOnSubmit = jest.fn();
    render(<SignUpForm onSubmit={mockOnSubmit} />);
  });

  afterEach(() => {
    cleanup();
  });

  test.each([
    {
      username: '',
      errorTestId: 'username-error',
      errorText: /username is required/i,
      description: 'empty username'
    },
    {
      username: 'ab',
      errorTestId: 'username-error',
      errorText: /at least 3 characters/i,
      description: 'username too short'
    },
    {
      username: 'A'.repeat(21),
      errorTestId: 'username-error',
      errorText: /username must be at most 20 characters/i,
      description: 'username too long'
    },
    {
      username: 'invalid user!',
      errorTestId: 'username-error',
      errorText:
        /username can only contain letters, numbers, underscores, and hyphens/i,
      description: 'username with invalid chars'
    },
    {
      username: 'alllowercase',
      errorTestId: 'username-error',
      errorText: /must contain at least one uppercase letter/i,
      description: 'username missing uppercase letter'
    },
    {
      username: 'ALLUPPERCASE',
      errorTestId: 'username-error',
      errorText: /must contain at least one lowercase letter/i,
      description: 'username missing lowercase letter'
    },
    {
      username: 'NoNumbersHere',
      errorTestId: 'username-error',
      errorText: /must contain at least one number/i,
      description: 'username missing number'
    }
  ])(
    'shows error when $description',
    async ({ username, errorTestId, errorText }) => {
      fillForm({ username });
      await submitForm();

      const errorMessage = await screen.findByTestId(errorTestId);
      expect(errorMessage).toHaveTextContent(errorText);
      expect(mockOnSubmit).not.toHaveBeenCalled();
    }
  );

  it('shows error when username is already taken', async () => {
    cleanup();
    const takenUserSubmit = jest.fn(async () => {
      throw new Error('Username already taken');
    });

    render(<SignUpForm onSubmit={takenUserSubmit} />);
    fillForm({ username: 'takenUser1' });
    await submitForm();

    const errorMessage = await screen.findByTestId('username-taken-error');
    expect(errorMessage).toHaveTextContent('This username is already taken');
  });

  it('trims leading and trailing spaces from username before submitting', async () => {
    cleanup();
    const trimSubmit = jest.fn();

    render(<SignUpForm onSubmit={trimSubmit} />);
    fillForm({ username: '  TrimUser1  ' });
    await submitForm();

    expect(trimSubmit).toHaveBeenCalledTimes(1);
    expect(trimSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'TrimUser1',
        email: 'user@example.com',
        password: 'ValidPass123!'
      })
    );
  });
});

describe('SignUpForm Password Validation', () => {
  let mockOnSubmit: jest.Mock;

  beforeEach(() => {
    mockOnSubmit = jest.fn();
    render(<SignUpForm onSubmit={mockOnSubmit} />);
  });

  afterEach(() => {
    cleanup();
  });

  test.each([
    {
      password: 'short!',
      errorTestId: 'password-error',
      errorText: /at least 8 characters/i,
      description: 'password too short'
    },
    {
      password: 'a'.repeat(128) + '!',
      errorTestId: 'password-error',
      errorText: /at most 128 characters/i,
      description: 'password too long'
    },
    {
      password: 'Password123',
      errorTestId: 'password-error',
      errorText: /at least one special character/i,
      description: 'password missing special character'
    },
    {
      password: 'alllowercase123!',
      errorTestId: 'password-error',
      errorText: /must contain at least one uppercase letter/i,
      description: 'password missing uppercase letter'
    },
    {
      password: 'PASSWORD123!',
      errorTestId: 'password-error',
      errorText: /at least one lowercase letter/i,
      description: 'password missing lowercase letter'
    },
    {
      password: 'Password!',
      errorTestId: 'password-error',
      errorText: /at least one number/i,
      description: 'password missing number'
    }
  ])(
    'shows error when $description',
    async ({ password, errorTestId, errorText }) => {
      fillForm({ password, confirmPassword: password });
      await submitForm();

      const errorMessage = await screen.findByTestId(errorTestId);
      expect(errorMessage).toHaveTextContent(errorText);
      expect(mockOnSubmit).not.toHaveBeenCalled();
    }
  );

  it('trims leading and trailing spaces from password before submitting', async () => {
    cleanup();
    const trimSubmit = jest.fn();

    render(<SignUpForm onSubmit={trimSubmit} />);
    fillForm({
      password: '  Password123!  ',
      confirmPassword: '  Password123!  '
    });
    await submitForm();

    expect(trimSubmit).toHaveBeenCalledTimes(1);
    expect(trimSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'ValidUser1',
        email: 'user@example.com',
        password: 'Password123!'
      })
    );
  });

  it('shows error when confirm password does not match the password', async () => {
    fillForm({
      password: 'Password123!',
      confirmPassword: 'DifferentPass123!'
    });

    await submitForm();

    const errorMessage = await screen.findByTestId('confirm-password-error');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(/passwords do not match/i);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});

describe('SignUpForm Submission Feedback', () => {
  it('displays and removes spinner overlay during form submission', async () => {
    const mockOnSubmit = jest.fn(
      () => new Promise((res) => setTimeout(res, 500))
    );

    render(<SignUpForm onSubmit={mockOnSubmit} />);

    fillForm({
      username: 'TestUser1',
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByTestId('spinner-overlay')).toBeInTheDocument();

    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalled());

    await waitFor(() => {
      expect(screen.queryByTestId('spinner-overlay')).not.toBeInTheDocument();
    });
  });

  it('submits the form successfully with valid data', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValueOnce(undefined);

    render(<SignUpForm onSubmit={mockOnSubmit} />);

    fillForm();

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalledTimes(1));

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'ValidUser1',
        email: 'user@example.com',
        password: 'ValidPass123!',
        confirmPassword: 'ValidPass123!'
      })
    );

    expect(screen.queryByTestId(/-error$/)).not.toBeInTheDocument();
  });
});

describe('SignUpForm Accessibility', () => {
  it('has no basic accessibility violations', async () => {
    const { container } = render(<SignUpForm onSubmit={jest.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('disables the submit button while submitting', async () => {
    const mockOnSubmit = jest.fn(
      () => new Promise((res) => setTimeout(res, 300))
    );

    render(<SignUpForm onSubmit={mockOnSubmit} />);
    fillForm();

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    await waitFor(() => expect(submitButton).toBeDisabled());

    await waitFor(() => expect(submitButton).not.toBeDisabled());
  });

  it('clears email taken error on successful resubmission', async () => {
    let fail = true;
    const mockOnSubmit = jest.fn(async () => {
      if (fail) {
        fail = false;
        throw new Error('Email already registered');
      }
    });

    render(<SignUpForm onSubmit={mockOnSubmit} />);
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByTestId('email-taken-error')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() =>
      expect(screen.queryByTestId('email-taken-error')).not.toBeInTheDocument()
    );
  });

  it('clears username taken error on successful resubmission', async () => {
    let fail = true;
    const mockOnSubmit = jest.fn(async () => {
      if (fail) {
        fail = false;
        throw new Error('Username already taken');
      }
    });

    render(<SignUpForm onSubmit={mockOnSubmit} />);
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(
      await screen.findByTestId('username-taken-error')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() =>
      expect(
        screen.queryByTestId('username-taken-error')
      ).not.toBeInTheDocument()
    );
  });

  it('focuses the first invalid input after submit', async () => {
    render(<SignUpForm onSubmit={jest.fn()} />);

    fillForm({ email: '' });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByLabelText(/email/i));
    });
  });

  it('focuses the first invalid input when multiple fields are valid', async () => {
    render(<SignUpForm onSubmit={jest.fn()} />);
    fillForm({ password: '', confirmPassword: '' });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByLabelText(/^password$/i));
    });
  });

  const getInvalidFields = () =>
    screen
      .getAllByLabelText(/./i)
      .filter((el) => el.getAttribute('aria-invalid') === 'true');

  it('marks invalid fields with aria-invalid', async () => {
    render(<SignUpForm onSubmit={jest.fn()} />);
    fillForm({ email: '', password: '' });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      const invalidFields = getInvalidFields();
      expect(invalidFields.map((el) => el.getAttribute('name'))).toEqual(
        expect.arrayContaining(['email', 'password'])
      );
      expect(invalidFields.length).toBe(2);
    });
  });

  it('sets aria-describedby to reference visible error messages', async () => {
    render(<SignUpForm onSubmit={jest.fn()} />);

    fillForm({ email: '', username: '' });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      const emailInput = screen.getByLabelText(/email/i);
      const usernameInput = screen.getByLabelText(/username/i);

      expect(emailInput).toHaveAttribute(
        'aria-describedby',
        expect.stringContaining('email-error')
      );

      expect(usernameInput).toHaveAttribute(
        'aria-describedby',
        expect.stringContaining('username-error')
      );

      expect(screen.getByTestId('email-error')).toBeVisible();
      expect(screen.getByTestId('username-error')).toBeVisible();
    });
  });

  it('associates each label correctly with its input via htmlFor and id', () => {
    render(<SignUpForm onSubmit={jest.fn()} />);

    const form = screen.getByTestId('sign-up-form');

    const allLabels = form.querySelectorAll('label');

    allLabels.forEach((label) => {
      const htmlFor = label.getAttribute('for');
      expect(htmlFor).toBeTruthy();

      const associatedInput = form.querySelector(`#${htmlFor}`);
      expect(associatedInput).not.toBeNull();

      expect(['INPUT']).toContain(associatedInput.tagName);
    });
  });

  it('hides error messages once the user corrects the input', async () => {
    render(<SignUpForm onSubmit={jest.fn()} />);

    fillForm({ username: '' });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByTestId('username-error')).toBeVisible();

    const usernameInput = screen.getByLabelText(/username/i);
    fireEvent.change(usernameInput, { target: { value: '' } });
    fireEvent.change(usernameInput, { target: { value: 'ValidUser1' } });

    await waitFor(() => {
      expect(screen.queryByTestId('username-error')).toBeNull();
    });
  });

  it('allows tabbing through input fields in order', async () => {
    render(<SignUpForm onSubmit={jest.fn()} />);

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    usernameInput.focus();
    expect(usernameInput).toHaveFocus();

    await userEvent.tab();
    expect(emailInput).toHaveFocus();

    await userEvent.tab();
    expect(passwordInput).toHaveFocus();

    await userEvent.tab();
    expect(confirmPasswordInput).toHaveFocus();

    await userEvent.tab();
    expect(submitButton).toHaveFocus();
  });

  it('announces submitting via aria-live region', async () => {
    const mockOnSubmit = jest.fn(
      () => new Promise((res) => setTimeout(res, 50))
    );
    render(<SignUpForm onSubmit={mockOnSubmit} />);
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() =>
      expect(screen.getByTestId('form-status-message')).toHaveTextContent(
        'Submitting...'
      )
    );
  });

  it('announces success after submission via aria-live region', async () => {
    const mockOnSubmit = jest.fn(() => Promise.resolve());
    render(<SignUpForm onSubmit={mockOnSubmit} />);
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() =>
      expect(screen.getByTestId('form-status-message')).toHaveTextContent(
        'Form submitted successfully!'
      )
    );
  });
});
