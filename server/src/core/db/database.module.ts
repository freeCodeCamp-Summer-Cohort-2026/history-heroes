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

        return {
          type: 'better-sqlite3',
          database: resolvedPath,
          autoLoadEntities: true,
          // **note** this should be only used locally, when in production if this is true the database could/would lose data
          synchronize: normalizeToBoolean(
            configService.get('DATABASE_SYNCHRONIZE', true),
          ),
          logging: configService.get<string>('NODE_ENV') === 'development',
        };
      },
    }),
  ],
})
export class DatabaseModule {}
