import { z } from 'zod';

export const registerRequestSchema = z.object({
  email: z.email(),
  // TODO: add password complexity requirements (e.g., uppercase, lowercase, number, special character) if needed
  password: z.string().min(8),
  isContentAuthor: z.boolean().optional().default(false),
});

export type RegisterRequestDto = z.infer<typeof registerRequestSchema>;
