import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, SignUpFormData } from '../schemas/sign-up-form-schema';

type SignUpFormProps = {
  onSubmit: (data: SignUpFormData) => Promise<void> | void;
};

export function SignUpForm({ onSubmit }: SignUpFormProps) {
  const [emailTakenError, setEmailTakenError] = useState('');
  const [usernameTakenError, setUsernameTakenError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ New state

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onSubmit'
  });

  async function handleFormSubmit(data: SignUpFormData) {
    setEmailTakenError('');
    setUsernameTakenError('');
    setIsSubmitting(true); // ✅ Show spinner

    try {
      await onSubmit(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Email already registered') {
          setEmailTakenError('This email is already registered');
        } else if (error.message === 'Username already taken') {
          setUsernameTakenError('This username is already taken');
        } else {
          throw error;
        }
      }
    } finally {
      setIsSubmitting(false); // ✅ Hide spinner
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      {/* ✅ Spinner overlay */}
      {isSubmitting && (
        <div
          data-testid='spinner-overlay'
          style={{
            padding: '1rem',
            marginBottom: '1rem',
            backgroundColor: '#f0f0f0',
            textAlign: 'center'
          }}>
          Submitting...
        </div>
      )}

      {/* Username field */}
      <div>
        <label htmlFor='username'>Username</label>
        <input
          id='username'
          type='text'
          {...register('username', {
            setValueAs: (val) => val.trim()
          })}
          aria-invalid={!!errors.username || !!usernameTakenError}
          aria-describedby='username-error username-taken-error'
        />
        {errors.username && (
          <p
            id='username-error'
            data-testid='username-error'
            style={{ color: 'red' }}>
            {errors.username.message}
          </p>
        )}
        {usernameTakenError && (
          <p
            id='username-taken-error'
            data-testid='username-taken-error'
            style={{ color: 'red' }}>
            {usernameTakenError}
          </p>
        )}
      </div>

      {/* Email field */}
      <div>
        <label htmlFor='email'>Email</label>
        <input
          id='email'
          type='email'
          {...register('email', {
            setValueAs: (val) => val.trim()
          })}
          aria-invalid={!!errors.email || !!emailTakenError}
          aria-describedby='email-error email-taken-error'
        />
        {errors.email && (
          <p
            id='email-error'
            data-testid='email-error'
            style={{ color: 'red' }}>
            {errors.email.message}
          </p>
        )}
        {emailTakenError && (
          <p
            id='email-taken-error'
            data-testid='email-taken-error'
            style={{ color: 'red' }}>
            {emailTakenError}
          </p>
        )}
      </div>

      {/* Password field */}
      <div>
        <label htmlFor='password'>Password</label>
        <input
          id='password'
          type='password'
          {...register('password', {
            setValueAs: (val) => val.trim()
          })}
          aria-invalid={!!errors.password}
          aria-describedby='password-error'
        />
        {errors.password && (
          <p
            id='password-error'
            data-testid='password-error'
            style={{ color: 'red' }}>
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password field */}
      <div>
        <label htmlFor='confirmPassword'>Confirm Password</label>
        <input
          id='confirmPassword'
          type='password'
          {...register('confirmPassword', {
            setValueAs: (val) => val.trim()
          })}
          aria-invalid={!!errors.confirmPassword}
          aria-describedby='confirm-password-error'
        />
        {errors.confirmPassword && (
          <p
            id='confirm-password-error'
            data-testid='confirm-password-error'
            style={{ color: 'red' }}>
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button type='submit' disabled={isSubmitting}>
        Sign Up
      </button>
    </form>
  );
}
