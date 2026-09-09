import { z } from 'zod';

export const UserSeedItemSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email().optional(),
  password: z.string().min(1, 'Password is required for seed users'),
});

export const UserSeedFileSchema = z.object({
  users: z.array(UserSeedItemSchema).nonempty('Users array cannot be empty'),
});

export type UserSeedItem = z.infer<typeof UserSeedItemSchema>;
export type UserSeedData = z.infer<typeof UserSeedFileSchema>;
