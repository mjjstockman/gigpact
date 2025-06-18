import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().nonempty('Email is required').email('Invalid email format')
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
