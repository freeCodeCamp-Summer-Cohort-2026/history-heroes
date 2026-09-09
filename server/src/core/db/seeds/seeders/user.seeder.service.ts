import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { User } from '../../../../users/entities/user.entity';
import { UserSeedData, UserSeedFileSchema } from '../schemas/user-seed.schema';
import { EntitySeeder } from './seeder.interface';

@Injectable()
export class UserSeeder implements EntitySeeder<UserSeedData> {
  private readonly logger = new Logger(UserSeeder.name);

  readonly name = 'users';
  readonly filePath = 'data/seeds/initial-users.json';
  readonly schema = UserSeedFileSchema;

  async seed(entityManager: EntityManager, data: UserSeedData): Promise<void> {
    this.logger.log(`Seeding ${data.users.length} initial users...`);

    const userEntities = data.users.map((item) =>
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
  }
}
