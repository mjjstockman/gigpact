'use client';

import { SignUpForm } from '@/components/sign-up-form';
import { supabase } from '@/lib/supabase/client'; // Adjust this import if needed
import { SignUpFormData } from '@/schemas/sign-up-form-schema';

export default function Page() {
  async function handleSubmit(data: SignUpFormData) {
    const { email, password, username } = data;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }, // store username as metadata
        // Optional: redirect URL after email confirmation
        emailRedirectTo: 'http://localhost:3000/auth/login'
      }
    });

    if (error) {
      if (error.message.includes('email')) {
        throw new Error('Email already registered');
      } else if (error.message.includes('username')) {
        throw new Error('Username already taken');
      }
      throw error;
    }
  }

  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <SignUpForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
