import { z } from 'zod';

export const ActivitySeedItemSchema = z.object({
  id: z.string().min(1),
  type: z.any(),
  title: z.string().min(3).max(100),
  checkStatement: z.string().min(1).max(255),
  content: z.any(),
  successCriteria: z.any(),
});

export const ActivitySeedFileSchema = z.object({
  activities: z
    .array(ActivitySeedItemSchema)
    .nonempty('Activities array cannot be empty'),
});

export type ActivitySeedItem = z.infer<typeof ActivitySeedItemSchema>;
export type ActivitySeedData = z.infer<typeof ActivitySeedFileSchema>;
