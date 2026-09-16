import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../users/entities/user.entity';
import { Module as ModuleEntity } from '../../../modules/entities/module.entity';
import { SeedsService } from './seeds.service';
import { UserSeeder } from './seeders/user.seeder.service';
import { ModuleSeeder } from './seeders/module.seeder.service';
import { LessonSeeder } from './seeders/lesson.seeder.service';
import { Lesson } from '../../../lessons/entities/lesson.entity';
import { Activity } from '../../../activities/entities/activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ModuleEntity, Lesson, Activity])],
  providers: [UserSeeder, ModuleSeeder, LessonSeeder, SeedsService],
  exports: [SeedsService],
})
export class SeedsModule {}
