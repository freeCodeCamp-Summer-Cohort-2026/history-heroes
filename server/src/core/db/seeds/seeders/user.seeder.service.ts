import { Injectable, Logger, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EntityManager } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../../../users/entities/user.entity';
import { UserSeedData, UserSeedFileSchema } from '../schemas/user-seed.schema';
import { EntitySeeder } from './seeder.interface';

@Injectable()
export class UserSeeder implements EntitySeeder<UserSeedData> {
  private readonly logger = new Logger(UserSeeder.name);
  private readonly saltRounds: number;

  readonly name = 'users';
  readonly filePath = 'data/seeds/initial-users.json';
  readonly schema = UserSeedFileSchema;

  constructor(@Optional() private readonly configService?: ConfigService) {
    const rounds = Number(
      this.configService?.get<number | string>('BCRYPT_SALT_ROUNDS', 10) ?? 10,
    );
    if (!Number.isInteger(rounds) || rounds < 10) {
      throw new Error('BCRYPT_SALT_ROUNDS must be at least 10');
    }
    this.saltRounds = rounds;
  }

  async seed(entityManager: EntityManager, data: UserSeedData): Promise<void> {
    this.logger.log(`Seeding ${data.users.length} initial users...`);

    const userEntities = await Promise.all(
      data.users.map(async (item) => {
        const hashedPassword = await bcrypt.hash(
          item.password,
          this.saltRounds,
        );
        return entityManager.create(User, {
          email: item.email,
          password: hashedPassword,
        });
      }),
    );

    await entityManager.save(User, userEntities);
  }
}
