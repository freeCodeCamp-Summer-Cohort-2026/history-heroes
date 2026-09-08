import { EntityManager } from 'typeorm';
import { z } from 'zod';

/**
 * Interface that represents the "shape" of a "seeder", or a service that
 * provides methods for seeding a specific entity type with data from a JSON file.
 */
export interface EntitySeeder<T = any> {
  /** The name of the seeder */
  readonly name: string;
  /**
   * The name of the file to load
   */
  readonly filePath: string;
  /**
   * The zod schema to apply to the file in its entirety, to ensure that the file is valid and contains all required fields.
   */
  readonly schema: z.ZodType<T>;
  /**
   * The "seed the database" method, that is called within an SQL transaction.
   *
   * @param entityManager the entity manager ref from sqlite3, used to perform the actual inserts into the database in a transaction, so all pass or all fail.
   * @param data the actual zchema data to save into the database, which has already been validated against the schema.
   */
  seed(entityManager: EntityManager, data: T): Promise<void>;
}
