import { z } from 'zod';

export const updateLessonSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    contents: z.string().optional(),
  })
  .strict();

export type UpdateLessonDto = z.infer<typeof updateLessonSchema>;
