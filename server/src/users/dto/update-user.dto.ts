import { z } from 'zod';

export const updateContentAuthorSchema = z.object({
  isContentAuthor: z.boolean(),
});

export type UpdateContentAuthorDto = z.infer<typeof updateContentAuthorSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
