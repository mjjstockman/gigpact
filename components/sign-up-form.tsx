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
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      {/* Username field */}
      <div>
        <label htmlFor='username'>Username</label>
        <input id='username' type='text' {...register('username')} />
        {errors.username && (
          <p data-testid='username-error'>{errors.username.message}</p>
        )}
        {usernameTakenError && (
          <p data-testid='username-taken-error' style={{ color: 'red' }}>
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
        />
        {errors.email && (
          <p data-testid='email-error'>{errors.email.message}</p>
        )}
        {emailTakenError && (
          <p data-testid='email-taken-error' style={{ color: 'red' }}>
            {emailTakenError}
          </p>
        )}
      </div>

      <button type='submit'>Sign Up</button>
    </form>
  );
}
