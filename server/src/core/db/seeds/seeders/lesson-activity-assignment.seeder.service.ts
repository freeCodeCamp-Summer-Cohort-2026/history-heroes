import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { LessonActivityAssignment } from '../../../../activities/entities/lesson-activity-assignment.entity';
import {
  LessonSeedData,
  LessonSeedFileSchema,
} from '../schemas/lessons-seed.schema';
import { EntitySeeder } from './seeder.interface';

/**
 * Seeder responsible for populating the `lesson_activity_assignments` join table.
 *
 * This relies on lesson data and creates alternate "inferred" data.
 *
 * It also relies/assumes lessons + activity tables already exist as this is a "join table".
 */
@Injectable()
export class LessonActivityAssignmentSeeder implements EntitySeeder<LessonSeedData> {
  private readonly logger = new Logger(LessonActivityAssignmentSeeder.name);

  readonly name = 'lesson_activity_assignments';
  readonly filePath = 'data/seeds/initial-lessons.json';
  readonly schema = LessonSeedFileSchema;

  async seed(
    entityManager: EntityManager,
    data: LessonSeedData,
  ): Promise<void> {
    this.logger.log('Seeding lesson activity assignments...');

    const assignmentEntities: LessonActivityAssignment[] = [];

    for (const lesson of data.lessons) {
      if (!lesson.activityIds || lesson.activityIds.length === 0) {
        continue;
      }

      lesson.activityIds.forEach((activityId, index) => {
        assignmentEntities.push(
          entityManager.create(LessonActivityAssignment, {
            lessonId: lesson.id,
            activityId,
            orderIndex: index + 1, // 1-based ordering within each lesson
          }),
        );
      });
    }

    if (assignmentEntities.length > 0) {
      await entityManager.save(LessonActivityAssignment, assignmentEntities);
      this.logger.log(
        `Seeded ${assignmentEntities.length} lesson activity assignments.`,
      );
    }
  }
}
