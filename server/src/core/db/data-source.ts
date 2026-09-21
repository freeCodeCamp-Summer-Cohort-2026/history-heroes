import { DataSource } from 'typeorm';
import * as path from 'path';

/**
 * Standalone TypeORM DataSource configuration for TypeORM CLI operations.
 *
 * This is required to support migrations, and runs outside of nestjs.
 *
 * Requires changes to the main DataSource configuration in src/core/db/database.module.ts if you change the database type or connection options. This will be done later once migrations are available/required.
 */
export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: process.env.DATABASE_STORAGE || 'data/dev.sqlite',
  entities: [path.join(__dirname, '../../**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'migrations/*{.ts,.js}')],
  synchronize: false,
});
