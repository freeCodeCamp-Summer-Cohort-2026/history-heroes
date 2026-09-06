import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { z } from 'zod';
import { User } from '../../../users/entities/user.entity';
import { UserSeedFileSchema, UserSeedData } from './schemas/user-seed.schema';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class SeedsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedsService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    await this.runSeeds();
  }

  /**
   * This single method will need to do most of the work for the atomic seeing process.
   * The main 2 steps are:
   * - validating the zod JSON files **all at once**
   * - validating the actual database transaction to insert
   *
   * At time of writing users are the only thing being added so this is clear, but some of
   * the code below has below has been tweaked to help future proof for other entities later.
   */
  async runSeeds() {
    const userRepo = this.dataSource.getRepository(User);
    const existingCount = await userRepo.count();

    if (existingCount > 0) {
      this.logger.log(
        'Database already contains users, using this as signal to skipping initial seed.',
      );
      return;
    }

    this.logger.log(
      'Empty database detected. Starting atomic seed pipeline...',
    );

    // Step 1: Load and strictly validate all JSON seed files BEFORE starting transaction
    const usersData = await this.loadAndValidateUsers();
    // TODO: other validation methods for other future entities must be added here.

    // Step 2: Run all inserts in an atomic transaction (all-or-nothing)
    await this.dataSource.transaction(async (entityManager) => {
      this.logger.log(`Seeding ${usersData.users.length} initial users...`);

      const userEntities = usersData.users.map((item) =>
        entityManager.create(User, {
          username: item.username,
          email: item.email,
          /**
           * SECURITY WARNING: Storing plaintext passwords is insecure and temporary.
           * This is strictly for local dev/testing initialization.
           * TODO: Hash/salt with bcrypt when authentication is implemented.
           */
          password: item.password,
        }),
      );

      await entityManager.save(User, userEntities);
      // TODO: other entities must be inserted in the same transactions.
    });

    this.logger.log('Atomic database seeding completed successfully.');
  }

  /**
   * Reads, resolves, and parses a JSON file from disk.
   *
   * @template T - The expected shape or type of the parsed JSON data.
   * @param relativeOrAbsolutePath - Path to the file, relative to the project root (`process.cwd()`) or absolute.
   * @returns A promise that resolves to the parsed JSON data of type `T`.
   * @throws Error if the file cannot be read from disk or contains invalid JSON.
   */
  private async loadAndParseJsonFile<T = unknown>(
    relativeOrAbsolutePath: string,
  ): Promise<T> {
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

    try {
      return JSON.parse(content) as T;
    } catch (err: any) {
      throw new Error(`Invalid JSON in ${seedPath}: ${err.message}`);
    }
  }

  private async loadAndValidateUsers(): Promise<UserSeedData> {
    const seedPath = 'data/seeds/initial-users.json';
    const parsed = await this.loadAndParseJsonFile(seedPath);

    const validationResult = UserSeedFileSchema.safeParse(parsed);
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
