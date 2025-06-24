import { z } from 'zod';

export const signUpSchema = z.object({
  email: z
    .string()
    .nonempty('Email is required')
    .email('Invalid email format')
    .transform((val) => val.trim()),
  username: z
    .string()
    .nonempty('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(
      /^[A-Za-z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens'
    )
    .refine(
      (val) => /[A-Z]/.test(val),
      'Username must contain at least one uppercase letter'
    )
    .refine(
      (val) => /[a-z]/.test(val),
      'Username must contain at least one lowercase letter'
    )
    .refine(
      (val) => /[0-9]/.test(val),
      'Username must contain at least one number'
    ),
  password: z
    .string()
    .nonempty('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
});
