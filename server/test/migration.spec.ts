import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Dynamically loads all migration classes from the migrations directory.
 * This ensures that when new migrations are added, the test suite automatically
 * includes them without requiring manual imports or maintenance.
 */
async function loadMigrations() {
  const migrationsDir = path.join(__dirname, '../src/core/db/migrations');
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))
    .sort(); // Ensure chronological execution order

  const migrations: Array<new () => unknown> = [];

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const module = await import(filePath);
    for (const exported of Object.values(module)) {
      if (typeof exported === 'function') {
        migrations.push(exported as new () => unknown);
      }
    }
  }

  return migrations;
}

describe('Database Migrations', () => {
  let dataSource: DataSource;

  beforeEach(async () => {
    const migrations = await loadMigrations();

    dataSource = new DataSource({
      type: 'better-sqlite3',
      database: ':memory:',
      synchronize: false,
      migrations,
      prepareDatabase: (database: { pragma: (statement: string) => void }) => {
        database.pragma('foreign_keys = ON');
      },
    });

    await dataSource.initialize();
  });

  afterEach(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('runs all migrations forward (up) successfully and creates tables', async () => {
    const executedMigrations = await dataSource.runMigrations();
    expect(executedMigrations.length).toBeGreaterThan(0);

    const tables: Array<{ name: string }> = await dataSource.query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
    );
    const tableNames = tables.map((t) => t.name);

    expect(tableNames).toContain('migrations');
    expect(tableNames.length).toBeGreaterThan(1);
  });

  it('reverts all migrations (down) successfully in reverse order', async () => {
    const executed = await dataSource.runMigrations();
    expect(executed.length).toBeGreaterThan(0);

    for (let i = 0; i < executed.length; i++) {
      await dataSource.undoLastMigration();
    }

    const tables: Array<{ name: string }> = await dataSource.query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
    );
    const tableNames = tables.map((t) => t.name);

    // Only the TypeORM 'migrations' metadata table should remain
    expect(tableNames).toEqual(['migrations']);
  });
});
