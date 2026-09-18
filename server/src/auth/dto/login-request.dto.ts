import { z } from 'zod';

export const loginRequestSchema = z.object({
  email: z.email(),
  // TODO: add password complexity requirements (e.g., uppercase, lowercase, number, special character) if needed
  password: z.string().min(8),
});

export type LoginRequestDto = z.infer<typeof loginRequestSchema>;
