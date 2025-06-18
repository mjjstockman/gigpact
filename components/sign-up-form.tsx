import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, SignUpFormData } from '../schemas/sign-up-form-schema';

type SignUpFormProps = {
  onSubmit: (data: SignUpFormData) => void;
};

export function SignUpForm({ onSubmit }: SignUpFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onSubmit'
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor='email'>Email</label>
        <input id='email' type='email' {...register('email')} />
        {errors.email && (
          <p data-testid='email-error'>{errors.email.message}</p>
        )}
      </div>
      <button type='submit'>Sign Up</button>
    </form>
  );
}

// 'use client';

// import { cn } from '@/lib/utils';
// import { createClient } from '@/lib/supabase/client';
// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle
// } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import { signUpSchema } from '@/schemas/sign-up-form-schema';
// import { ZodError } from 'zod';

// type SignUpFormProps = React.ComponentPropsWithoutRef<'div'> & {
//   onSubmit?: (data: {
//     username: string;
//     email: string;
//     password: string;
//     repeatPassword: string;
//   }) => void;
// };

// export function SignUpForm({ className, onSubmit, ...props }: SignUpFormProps) {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [repeatPassword, setRepeatPassword] = useState('');
//   const [emailError, setEmailError] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   const handleSignUp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setEmailError(null);
//     setError(null);

//     try {
//       signUpSchema.parse({ email });
//     } catch (err) {
//       if (err instanceof ZodError) {
//         const issue = err.issues.find((i) => i.path[0] === 'email');
//         if (issue) {
//           setEmailError(issue.message);
//           return;
//         }
//       }
//     }

//     if (onSubmit) {
//       onSubmit({ username, email, password, repeatPassword });
//     }

//     // We are not signing up via Supabase in this TDD stage
//     // Uncomment the below if you want to enable real signup
//     /*
//     const supabase = createClient();
//     setIsLoading(true);
//     try {
//       const { error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           emailRedirectTo: `${window.location.origin}/protected`,
//           data: { username }
//         }
//       });

//       if (error) throw error;
//       router.push('/auth/sign-up-success');
//     } catch (error: unknown) {
//       setError(error instanceof Error ? error.message : 'An error occurred');
//     } finally {
//       setIsLoading(false);
//     }
//     */
//   };

//   return (
//     <div className={cn('flex flex-col gap-6', className)} {...props}>
//       <Card>
//         <CardHeader>
//           <CardTitle className='text-2xl'>Sign up</CardTitle>
//           <CardDescription>Create a new account</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSignUp}>
//             <div className='flex flex-col gap-6'>
//               <div className='grid gap-2'>
//                 <Label htmlFor='username'>Username</Label>
//                 <Input
//                   id='username'
//                   type='text'
//                   placeholder='your_username'
//                   required
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                 />
//               </div>
//               <div className='grid gap-2'>
//                 <Label htmlFor='email'>Email</Label>
//                 <Input
//                   id='email'
//                   type='email'
//                   placeholder='m@example.com'
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//                 {emailError && (
//                   <p className='text-sm text-red-500'>{emailError}</p>
//                 )}
//               </div>
//               <div className='grid gap-2'>
//                 <Label htmlFor='password'>Password</Label>
//                 <Input
//                   id='password'
//                   type='password'
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//               </div>
//               <div className='grid gap-2'>
//                 <Label htmlFor='repeat-password'>Repeat Password</Label>
//                 <Input
//                   id='repeat-password'
//                   type='password'
//                   required
//                   value={repeatPassword}
//                   onChange={(e) => setRepeatPassword(e.target.value)}
//                 />
//               </div>
//               {error && <p className='text-sm text-red-500'>{error}</p>}
//               <Button type='submit' className='w-full' disabled={isLoading}>
//                 {isLoading ? 'Creating an account...' : 'Sign up'}
//               </Button>
//             </div>
//             <div className='mt-4 text-center text-sm'>
//               Already have an account?{' '}
//               <Link href='/auth/login' className='underline underline-offset-4'>
//                 Login
//               </Link>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
