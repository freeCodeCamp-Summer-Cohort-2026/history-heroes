import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { EntitySeeder } from './seeder.interface';
import { LabSeedData, LabSeedFileSchema } from '../schemas/lab-seed.schema';
import { Lab } from '../../../../labs/entities/lab.entity';

@Injectable()
export class LabSeeder implements EntitySeeder<LabSeedData> {
  private readonly logger = new Logger(LabSeeder.name);

  readonly name = 'labs';
  readonly filePath = 'data/seeds/initial-labs.json';
  readonly schema = LabSeedFileSchema;

  async seed(entityManager: EntityManager, data: LabSeedData): Promise<void> {
    this.logger.log(`Seeding ${data.labs.length} initial labs...`);

    const labEntities = data.labs.map((item) =>
      entityManager.create(Lab, {
        id: item.id,
        moduleId: item.moduleId,
        title: item.title,
        description: item.description,
      }),
    );

    await entityManager.save(Lab, labEntities);
  }
}
