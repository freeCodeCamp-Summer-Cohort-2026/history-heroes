import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Module } from '../../../../modules/entities/module.entity';
import {
  ModuleSeedData,
  ModuleSeedFileSchema,
} from '../schemas/modules-seed.schema';
import { EntitySeeder } from './seeder.interface';

@Injectable()
export class ModuleSeeder implements EntitySeeder<ModuleSeedData> {
  private readonly logger = new Logger(ModuleSeeder.name);

  readonly name = 'modules';
  readonly filePath = 'data/seeds/initial-modules.json';
  readonly schema = ModuleSeedFileSchema;

  async seed(
    entityManager: EntityManager,
    data: ModuleSeedData,
  ): Promise<void> {
    this.logger.log(`Seeding ${data.modules.length} initial modules...`);

    const moduleEntities = data.modules.map((item) =>
      entityManager.create(Module, {
        id: item.id,
        title: item.title,
        description: item.description,
        order: item.order ?? 0,
      }),
    );

    await entityManager.save(Module, moduleEntities);
  }
}
