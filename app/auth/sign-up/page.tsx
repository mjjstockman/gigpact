'use client';

import { SignUpForm } from '@/components/sign-up-form';

export default function Page() {
  async function handleSubmit(data) {
    // handle form submission, e.g. API call
    console.log('Form submitted with data:', data);
  }

  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <SignUpForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
