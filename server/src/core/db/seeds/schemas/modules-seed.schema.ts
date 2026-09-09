import { z } from 'zod';

export const ModuleSeedItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3).max(100),
  description: z.string().max(255),
  order: z.number().int().nonnegative().optional(),
});

export const ModuleSeedFileSchema = z.object({
  modules: z
    .array(ModuleSeedItemSchema)
    .nonempty('Modules array cannot be empty'),
});

export type ModuleSeedItem = z.infer<typeof ModuleSeedItemSchema>;
export type ModuleSeedData = z.infer<typeof ModuleSeedFileSchema>;
