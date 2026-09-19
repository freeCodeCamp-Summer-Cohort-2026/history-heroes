import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { EntitySeeder } from './seeder.interface';
import { LabSeedData, LabSeedFileSchema } from '../schemas/lab-seed.schema';
import { LabActivityAssignment } from '../../../../activities/entities/lab-activity-assignment.entity';

/**
 * Seeder responsible for populating the `lab_activity_assignments` join table.
 *
 * This relies on lab data and creates alternate "inferred" data.
 *
 * It also relies/assumes labs + activity tables already exist as this is a "join table".
 */
@Injectable()
export class LabActivityAssignmentSeeder implements EntitySeeder<LabSeedData> {
  private readonly logger = new Logger(LabActivityAssignmentSeeder.name);

  readonly name = 'lab_activity_assignments';
  readonly filePath = 'data/seeds/initial-labs.json';
  readonly schema = LabSeedFileSchema;

  async seed(entityManager: EntityManager, data: LabSeedData): Promise<void> {
    this.logger.log('Seeding lab activity assignments...');

    const assignmentEntities: LabActivityAssignment[] = [];

    for (const lab of data.labs) {
      if (!lab.activityIds || lab.activityIds.length === 0) {
        continue;
      }

      lab.activityIds.forEach((activityId) => {
        assignmentEntities.push(
          entityManager.create(LabActivityAssignment, {
            labId: lab.id,
            activityId,
          }),
        );
      });
    }

    if (assignmentEntities.length > 0) {
      await entityManager.save(LabActivityAssignment, assignmentEntities);
      this.logger.log(
        `Seeded ${assignmentEntities.length} lab activity assignments.`,
      );
    }
  }
}
