import { z } from 'zod';

export const updateModuleSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    period: z.string().nullable().optional(),
    theme: z.string().nullable().optional(),
  })
  .strict();

export type UpdateModuleDto = z.infer<typeof updateModuleSchema>;
