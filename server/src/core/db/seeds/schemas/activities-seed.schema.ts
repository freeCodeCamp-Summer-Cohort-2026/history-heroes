import { z } from 'zod';

const setsIdenticalAndNoEmptyStrings = (
  a: Set<string>,
  b: Set<string>,
): boolean => {
  if (a.size !== b.size) return false;

  for (const aVal of a.values()) {
    if (aVal === '' || !b.has(aVal)) return false;
  }

  return true;
};

const Ordering = z
  .object({
    type: z.literal('ordering'),
    content: z.object({
      items: z
        .array(z.object({ id: z.string(), label: z.string() }))
        .nonempty(),
    }),
    successCriteria: z.object({
      correctOrder: z.array(z.string()).nonempty(),
    }),
  })
  .refine(({ content, successCriteria }): boolean => {
    const contentIds = new Set(content.items.map((item) => item.id));
    const successIds = new Set(successCriteria.correctOrder);

    return setsIdenticalAndNoEmptyStrings(contentIds, successIds);
  });

const Matching = z
  .object({
    type: z.literal('matching'),
    content: z.object({
      left: z.array(z.object({ id: z.string(), label: z.string() })).nonempty(),
      right: z
        .array(z.object({ id: z.string(), label: z.string() }))
        .nonempty(),
    }),
    successCriteria: z.object({
      pairs: z
        .array(
          z.object({
            left: z.string(),
            right: z.string(),
          }),
        )
        .nonempty(),
    }),
  })
  .refine(({ content, successCriteria }) => {
    const contentIds = new Set([
      ...content.left.map((e) => e.id),
      ...content.right.map((e) => e.id),
    ]);
    const successIds = new Set(
      successCriteria.pairs.reduce(
        (acc: string[], e) => [...acc, e.left, e.right],
        [],
      ),
    );

    return setsIdenticalAndNoEmptyStrings(contentIds, successIds);
  });

const ActivityTypes = z.discriminatedUnion('type', [Ordering, Matching]);

export const ActivitySeedItemSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(3).max(100),
    checkStatement: z.string().min(1).max(255),
  })
  .and(ActivityTypes);

export const ActivitySeedFileSchema = z.object({
  activities: z
    .array(ActivitySeedItemSchema)
    .nonempty('Activities array cannot be empty'),
});

export type ActivitySeedItem = z.infer<typeof ActivitySeedItemSchema>;
export type ActivitySeedData = z.infer<typeof ActivitySeedFileSchema>;
