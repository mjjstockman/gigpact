'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, SignUpFormData } from '../schemas/sign-up-form-schema';

type SignUpFormProps = {
  onSubmit: (data: SignUpFormData) => Promise<void> | void;
};

export function SignUpForm({ onSubmit }: SignUpFormProps) {
  const [emailTakenError, setEmailTakenError] = useState('');
  const [usernameTakenError, setUsernameTakenError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
    setSubmitSuccess(false);
    setIsSubmitting(true);

    try {
      await onSubmit(data);
      setSubmitSuccess(true);
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
      setIsSubmitting(false);
    }
  }

  // Optional: Clear success message after a short delay
  useEffect(() => {
    if (submitSuccess) {
      const timeout = setTimeout(() => setSubmitSuccess(false), 4000);
      return () => clearTimeout(timeout);
    }
  }, [submitSuccess]);

  return (
    <form
      data-testid='sign-up-form'
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate>
      {/* ✅ Accessible status message region */}
      <div
        aria-live='polite'
        aria-atomic='true'
        data-testid='form-status-message'
        style={{
          position: 'absolute',
          left: '-9999px',
          height: '1px',
          width: '1px',
          overflow: 'hidden'
        }}>
        {isSubmitting
          ? 'Submitting...'
          : submitSuccess
          ? 'Form submitted successfully!'
          : ''}
      </div>

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
