import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Helper function that normalizes "true" or true to just true.
 *
 * @param val the value to check
 */
function normalizeToBoolean(val: string | boolean | unknown): boolean {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') return val.toLowerCase() === 'true';
  return false;
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbPath = configService.get<string>(
          'DATABASE_STORAGE',
          'data/dev.sqlite',
        );
        const resolvedPath = path.resolve(process.cwd(), dbPath);

        // Ensure database directory exists before better-sqlite3 attempts to open/create file
        const dir = path.dirname(resolvedPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        const nodeEnv = configService.get<string>('NODE_ENV')?.toLowerCase();
        const isDevOrTest = nodeEnv === 'development' || nodeEnv === 'test';

        return {
          type: 'better-sqlite3',
          database: resolvedPath,
          prepareDatabase: (database: { pragma: (statement: string) => void }) => {
            database.pragma('foreign_keys = ON');
          },
          autoLoadEntities: true,
          // Auto-synchronize schema by default only in development and test environments.
          // Outside dev/test (e.g. production), it defaults to false to prevent accidental schema changes or data loss.
          synchronize: normalizeToBoolean(
            configService.get('DATABASE_SYNCHRONIZE', isDevOrTest),
          ),
          logging: nodeEnv === 'development',
        };
      },
    }),
  ],
})
export class DatabaseModule {}
