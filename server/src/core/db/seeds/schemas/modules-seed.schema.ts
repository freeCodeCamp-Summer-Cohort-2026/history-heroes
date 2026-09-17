import { z } from 'zod';

export const ModuleSeedItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3).max(100),
  description: z.string().max(255),
  order: z.number().int().nonnegative().optional(),
});

export const ModuleSeedFileSchema = z
  .object({
    modules: z
      .array(ModuleSeedItemSchema)
      .nonempty('Modules array cannot be empty'),
  })
  .superRefine(({ modules }, ctx) => {
    const seenIds = new Set<string>();
    const seenOrders = new Set<number>();

    for (let i = 0; i < modules.length; i++) {
      const module = modules[i];

      // Validate unique module id
      if (seenIds.has(module.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate module id: '${module.id}'`,
          path: ['modules', i, 'id'],
        });
      }
      seenIds.add(module.id);

      // Validate unique module order if defined
      if (module.order !== undefined) {
        if (seenOrders.has(module.order)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Duplicate module order: '${module.order}'`,
            path: ['modules', i, 'order'],
          });
        }
        seenOrders.add(module.order);
      }
    }
  });

export type ModuleSeedItem = z.infer<typeof ModuleSeedItemSchema>;
export type ModuleSeedData = z.infer<typeof ModuleSeedFileSchema>;
