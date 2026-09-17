import { z } from 'zod';

export const LessonSeedItemSchema = z.object({
  id: z.string().min(1).max(50),
  moduleId: z.string().min(1).max(50),
  title: z.string().min(3).max(100),
  description: z.string().max(255),
  contents: z.string().min(1),
  orderIndex: z.number().int().positive(),
  activityIds: z.array(z.string().min(1)).optional().default([]),
});

export const LessonSeedFileSchema = z
  .object({
    lessons: z
      .array(LessonSeedItemSchema)
      .nonempty('Lessons array cannot be empty'),
  })
  .superRefine(({ lessons }, ctx) => {
    const seenIds = new Set<string>();
    const seenModuleOrder = new Set<string>();

    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];

      if (seenIds.has(lesson.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate lesson id: '${lesson.id}'`,
          path: ['lessons', i, 'id'],
        });
      }
      seenIds.add(lesson.id);

      const moduleOrderKey = `${lesson.moduleId}:${lesson.orderIndex}`;
      if (seenModuleOrder.has(moduleOrderKey)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate orderIndex '${lesson.orderIndex}' in module '${lesson.moduleId}'`,
          path: ['lessons', i, 'orderIndex'],
        });
      }
      seenModuleOrder.add(moduleOrderKey);
    }
  });

export type LessonSeedItem = z.infer<typeof LessonSeedItemSchema>;
export type LessonSeedData = z.infer<typeof LessonSeedFileSchema>;
