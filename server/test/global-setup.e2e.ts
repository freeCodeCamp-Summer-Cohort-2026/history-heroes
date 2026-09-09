/// <reference types="node" />
import * as fs from 'node:fs';
import * as path from 'node:path';
import process from 'node:process';

const TEST_DB_PATH = 'data/test.sqlite';

/**
 * Removes the temporary SQLite test database and any associated SQLite auxiliary
 * files (.sqlite, -journal, -wal, -shm) to ensure test isolation and clean up artifacts.
 */
function cleanTestDb() {
  const resolvedPath = path.resolve(process.cwd(), TEST_DB_PATH);

  // Suffixes for SQLite database and its temporary/transactional files:
  // ''         - Primary SQLite database file (e.g., test.sqlite)
  // '-journal' - Rollback journal created during transactions in rollback journal mode
  // '-wal'     - Write-Ahead Log containing committed transactions when running in WAL mode
  // '-shm'     - Shared-memory index file used alongside the WAL file to coordinate concurrent reads/writes
  const suffixes = ['', '-journal', '-wal', '-shm'];

  for (const suffix of suffixes) {
    const file = `${resolvedPath}${suffix}`;
    if (fs.existsSync(file)) {
      try {
        fs.unlinkSync(file);
      } catch {
        // ignore if locked or already removed
      }
    }
  }
}

export function setup() {
  cleanTestDb();
}

export function teardown() {
  cleanTestDb();
}
