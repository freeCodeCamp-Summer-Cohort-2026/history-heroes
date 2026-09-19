import { z } from 'zod';

export const LabSeedItemSchema = z.object({
  id: z.string().min(1).max(50),
  moduleId: z.string().min(1).max(50),
  title: z.string().min(3).max(100),
  description: z.string().max(255),
  activityIds: z.array(z.string().min(1)).optional().default([]),
});

export const LabSeedFileSchema = z
  .object({
    labs: z.array(LabSeedItemSchema).nonempty('Labs array cannot be empty'),
  })
  .superRefine(({ labs }, ctx) => {
    const seenIds = new Set<string>();

    for (let i = 0; i < labs.length; i++) {
      const lab = labs[i];

      if (seenIds.has(lab.id)) {
        ctx.addIssue({
          code: 'custom',
          message: `Duplicate lab id: '${lab.id}'`,
          path: ['labs', i, 'id'],
        });
      }
      seenIds.add(lab.id);
    }
  });

export type LabSeedItem = z.infer<typeof LabSeedItemSchema>;
export type LabSeedData = z.infer<typeof LabSeedFileSchema>;
