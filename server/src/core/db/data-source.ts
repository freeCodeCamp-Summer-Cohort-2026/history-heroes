import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Standalone TypeORM DataSource configuration for TypeORM CLI operations.
 *
 * This is required to support migrations, and runs outside of nestjs.
 */
const dbPath = process.env.DATABASE_STORAGE || 'data/dev.sqlite';
const resolvedPath = path.resolve(process.cwd(), dbPath);

// Ensure database directory exists before better-sqlite3 attempts to open/create file
const dir = path.dirname(resolvedPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: resolvedPath,
  prepareDatabase: (database: { pragma: (statement: string) => void }) => {
    database.pragma('foreign_keys = ON');
  },
  entities: [path.join(__dirname, '../../**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'migrations/*{.ts,.js}')],
  synchronize: false,
});
