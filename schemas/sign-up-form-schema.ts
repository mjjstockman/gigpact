import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format')
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
