import { z } from 'zod';

const idErrors = {
  MISMATCHED: 'Mismatched ID(s)',
  MISSING: 'Missing ID(s)',
  DUPLICATE: 'Duplicate ID(s)',
};

const idsMatch = (a: string[], b: string[]): string | undefined => {
  // create sets and check for duplicate ids

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

  const setA = new Set(a);
  if (a.length !== setA.size) return idErrors.DUPLICATE;

  const setB = new Set(b);
  if (b.length !== setB.size) return idErrors.DUPLICATE;

  // compare set sizes
  if (setA.size !== setB.size) return idErrors.MISMATCHED;

  // check that all values of one set exist in the other
  for (const aVal of setA.values()) {
    if (!setB.has(aVal)) return idErrors.MISSING;
  }
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
  .superRefine(({ content, successCriteria }, ctx): void => {
    const contentIds = content.items.map((item) => item.id);
    const successIds = successCriteria.correctOrder;

    const matchResult = idsMatch(contentIds, successIds);
    if (matchResult) ctx.addIssue(matchResult);
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
  .superRefine(({ content, successCriteria }, ctx): void => {
    const contentIdsLeft = content.left.map((e) => e.id);
    const contentIdsRight = content.right.map((e) => e.id);

    const successIdsLeft: string[] = [];
    const successIdsRight: string[] = [];
    successCriteria.pairs.forEach((e) => {
      successIdsLeft.push(e.left);
      successIdsRight.push(e.right);
    });

    const leftResult = idsMatch(contentIdsLeft, successIdsLeft);
    const rightResult = idsMatch(contentIdsRight, successIdsRight)

    if (leftResult) ctx.addIssue(leftResult);
    if (rightResult) ctx.addIssue(rightResult);
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
