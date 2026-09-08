import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { User } from '../../../users/entities/user.entity';
import { EntitySeeder } from './seeders/seeder.interface';
import { UserSeeder } from './seeders/user.seeder.service';
import { ModuleSeeder } from './seeders/module.seeder.service';

@Injectable()
export class SeedsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedsService.name);

  /**
   * Ordered list of seeders to execute during the seeding pipeline.
   * Add new entity seeders here to extend the pipeline.
   */
  private readonly seeders: EntitySeeder[];

  constructor(
    private readonly dataSource: DataSource,
    userSeeder: UserSeeder,
    moduleSeeder: ModuleSeeder,
  ) {
    this.seeders = [userSeeder, moduleSeeder];
  }

  async onApplicationBootstrap() {
    await this.runSeeds();
  }

  /**
   * Orchestrates the atomic database seeding process:
   * 1. Checks if the database has already been seeded.
   * 2. Loads and strictly validates all JSON seed files up front.
   * 3. Inserts entities atomically inside a single database transaction.
   */
  async runSeeds() {
    if (await this.isDatabaseSeeded()) {
      this.logger.log(
        'Database already contains users, using this as signal to skipping initial seed.',
      );
      return;
    }

    this.logger.log(
      'Empty database detected. Starting atomic seed pipeline...',
    );

    // Step 1: Load and strictly validate all JSON seed files BEFORE starting transaction
    const validatedDatasets = await Promise.all(
      this.seeders.map(async (seeder) => ({
        seeder,
        data: await this.loadAndValidate(seeder.filePath, seeder.schema),
      })),
    );

    // Step 2: Run all inserts in an atomic transaction (all-or-nothing)
    await this.dataSource.transaction(async (entityManager) => {
      for (const { seeder, data } of validatedDatasets) {
        await seeder.seed(entityManager, data);
      }
    });

    this.logger.log('Atomic database seeding completed successfully.');
  }

  /**
   * Determines if the database already contains seeded data.
   */
  private async isDatabaseSeeded(): Promise<boolean> {
    const userRepo = this.dataSource.getRepository(User);
    const existingCount = await userRepo.count();
    return existingCount > 0;
  }

  /**
   * Reads a JSON seed file from disk, parses it, and validates it against a Zod schema.
   *
   * @template T - The Zod schema type.
   * @param relativeOrAbsolutePath - Path to the seed file, relative to the project root (`process.cwd()`) or absolute.
   * @param schema - The Zod schema to validate the parsed JSON data against.
   * @returns A promise that resolves to the validated data.
   * @throws Error if the file cannot be read, contains invalid JSON, or fails schema validation.
   */
  private async loadAndValidate<T extends z.ZodTypeAny>(
    relativeOrAbsolutePath: string,
    schema: T,
  ): Promise<z.infer<T>> {
    const seedPath = path.isAbsolute(relativeOrAbsolutePath)
      ? relativeOrAbsolutePath
      : path.resolve(process.cwd(), relativeOrAbsolutePath);

    let content: string;
    try {
      content = await fs.readFile(seedPath, 'utf-8');
    } catch (err: any) {
      throw new Error(
        `Failed to load seed file at ${seedPath}: ${err.message}`,
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch (err: any) {
      throw new Error(`Invalid JSON in ${seedPath}: ${err.message}`);
    }

    const validationResult = schema.safeParse(parsed);
    if (!validationResult.success) {
      this.logger.error(
        `Seed validation failed for ${seedPath}:\n${z.prettifyError(validationResult.error)}`,
      );
      throw new Error(
        `Validation failed for ${seedPath}: ${JSON.stringify(validationResult.error.issues)}`,
      );
    }

    return validationResult.data;
  }
}
