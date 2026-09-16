import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Activity } from '../../../../activities/entities/activity.entity';
import {
  ActivitySeedData,
  ActivitySeedFileSchema,
} from '../schemas/activities-seed.schema';
import { EntitySeeder } from './seeder.interface';

@Injectable()
export class ActivitySeeder implements EntitySeeder<ActivitySeedData> {
  private readonly logger = new Logger(ActivitySeeder.name);

  readonly name = 'activities';
  readonly filePath = 'data/seeds/initial-activities.json';
  readonly schema = ActivitySeedFileSchema;

  async seed(
    entityManager: EntityManager,
    data: ActivitySeedData,
  ): Promise<void> {
    this.logger.log(`Seeding ${data.activities.length} initial activities...`);

    const activityEntities = data.activities.map((item) =>
      entityManager.create(Activity, {
        id: item.id,
        title: item.title,
        type: item.type,
        checkStatement: item.checkStatement,
        content: item.content,
        successCriteria: item.successCriteria,
      }),
    );

    await entityManager.save(Activity, activityEntities);
  }
}
