import { z } from 'zod';

const Ordering = z.object({
  type: z.literal('ordering'),
  content: z.object({
    items: z.array(z.object({ id: z.string(), label: z.string() })),
  }),
  successCriteria: z.object({
    correctOrder: z.array(z.string()),
  }),
});

const Matching = z.object({
  type: z.literal('matching'),
  content: z.object({
    left: z.array(z.object({ id: z.string(), label: z.string() })),
    right: z.array(z.object({ id: z.string(), label: z.string() })),
  }),
  successCriteria: z.object({
    pairs: z.array(
      z.object({
        left: z.string(),
        right: z.string(),
      }),
    ),
  }),
});

const ActivityTypes = z.discriminatedUnion('type', [Ordering, Matching]);

export const ActivitySeedItemSchema = z.object({
  id: z.string().min(1),
  type: z.enum(ActivityTypes.options.map((e) => e.shape.type.value)),
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
