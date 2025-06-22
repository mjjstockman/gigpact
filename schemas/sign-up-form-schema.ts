import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().nonempty('Email is required').email('Invalid email format'),
  username: z
    .string()
    .nonempty('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
