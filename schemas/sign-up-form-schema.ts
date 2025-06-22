import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().nonempty('Email is required').email('Invalid email format'),
  username: z.string().nonempty('Username is required')
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
