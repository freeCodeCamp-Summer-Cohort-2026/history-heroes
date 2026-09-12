import { z } from 'zod';

const idsMatch = (a: string[], b: string[]): boolean => {
  // create sets and check for duplicate ids
  const setA = new Set(a);
  if (a.length !== setA.size) return false;

  const setB = new Set(b);
  if (b.length !== setB.size) return false;

  /*
   Duplicate checking ensures one-to-one matching for matching activities.

   Valid:
   A <--> B
   B <--> A

   Within each side, no item is duplicated. Matching is one-to-one. A Set made from either side will not collapse.

   Invalid:
   A <--> B
   A <--> C

   Item A is duplicated within the left side, effectively pairing it with both B and C. Matching is not one-to-one. A Set made from the left side will collapse, causing the dupe check to fail.
   */

  // compare set sizes
  if (setA.size !== setB.size) return false;

  // check that all values of one set exist in the other
  for (const aVal of setA.values()) {
    if (!setB.has(aVal)) return false;
  }

  return true;
};

const Ordering = z
  .object({
    type: z.literal('ordering'),
    content: z.object({
      items: z
        .array(z.object({ id: z.string().nonempty(), label: z.string() }))
        .nonempty(),
    }),
    successCriteria: z.object({
      correctOrder: z.array(z.string().nonempty()).nonempty(),
    }),
  })
  .refine(({ content, successCriteria }): boolean => {
    const contentIds = content.items.map((item) => item.id);
    const successIds = successCriteria.correctOrder;

    return idsMatch(contentIds, successIds);
  });

const Matching = z
  .object({
    type: z.literal('matching'),
    content: z.object({
      left: z
        .array(z.object({ id: z.string().nonempty(), label: z.string() }))
        .nonempty(),
      right: z
        .array(z.object({ id: z.string().nonempty(), label: z.string() }))
        .nonempty(),
    }),
    successCriteria: z.object({
      pairs: z
        .array(
          z.object({
            left: z.string().nonempty(),
            right: z.string().nonempty(),
          }),
        )
        .nonempty(),
    }),
  })
  .refine(({ content, successCriteria }) => {
    const contentIdsLeft = content.left.map((e) => e.id);
    const contentIdsRight = content.right.map((e) => e.id);

    const successIdsLeft: string[] = [];
    const successIdsRight: string[] = [];
    successCriteria.pairs.forEach((e) => {
      successIdsLeft.push(e.left);
      successIdsRight.push(e.right);
    });

    return (
      idsMatch(contentIdsLeft, successIdsLeft) &&
      idsMatch(contentIdsRight, successIdsRight)
    );
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
