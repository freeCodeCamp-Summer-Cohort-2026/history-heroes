import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../users/entities/user.entity';
import { Module as ModuleEntity } from '../../../modules/entities/module.entity';
import { SeedsService } from './seeds.service';
import { UserSeeder } from './seeders/user.seeder.service';
import { ModuleSeeder } from './seeders/module.seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, ModuleEntity])],
  providers: [UserSeeder, ModuleSeeder, SeedsService],
  exports: [SeedsService],
})
export class SeedsModule {}
