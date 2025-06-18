import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, SignUpFormData } from '../schemas/sign-up-form-schema';

type SignUpFormProps = {
  onSubmit: (data: SignUpFormData) => Promise<void> | void;
};

export function SignUpForm({ onSubmit }: SignUpFormProps) {
  const [emailTakenError, setEmailTakenError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onSubmit'
  });

  // Wrap onSubmit to handle email-taken error
  async function handleFormSubmit(data: SignUpFormData) {
    setEmailTakenError(''); // reset error before submit
    try {
      await onSubmit(data);
    } catch (error: unknown) {
      // Adjust error handling based on your error shape
      if (
        error instanceof Error &&
        error.message === 'Email already registered'
      ) {
        setEmailTakenError('This email is already registered');
      } else {
        // Optionally handle other errors or rethrow
        throw error;
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div>
        <label htmlFor='email'>Email</label>
        <input id='email' type='email' {...register('email')} />
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
