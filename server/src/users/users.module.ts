import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

/**
 * **note** modules are defined almost like a "nestjs" specific box to control what can be injected/provided to the controllers/providers in a given module.
 */
@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
