import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Lesson } from '../../../../lessons/entities/lesson.entity';
import {
  LessonSeedData,
  LessonSeedFileSchema,
} from '../schemas/lessons-seed.schema';
import { EntitySeeder } from './seeder.interface';

@Injectable()
export class LessonSeeder implements EntitySeeder<LessonSeedData> {
  private readonly logger = new Logger(LessonSeeder.name);

  readonly name = 'lessons';
  readonly filePath = 'data/seeds/initial-lessons.json';
  readonly schema = LessonSeedFileSchema;

  async seed(
    entityManager: EntityManager,
    data: LessonSeedData,
  ): Promise<void> {
    this.logger.log(`Seeding ${data.lessons.length} initial lessons...`);

    const lessonEntities = data.lessons.map((item) =>
      entityManager.create(Lesson, {
        id: item.id,
        moduleId: item.moduleId,
        title: item.title,
        description: item.description,
        contents: item.contents,
        orderIndex: item.orderIndex,
      }),
    );

    await entityManager.save(Lesson, lessonEntities);
  }
}
