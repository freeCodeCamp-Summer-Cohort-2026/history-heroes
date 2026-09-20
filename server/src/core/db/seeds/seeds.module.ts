import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../users/entities/user.entity';
import { Module as ModuleEntity } from '../../../modules/entities/module.entity';
import { SeedsService } from './seeds.service';
import { UserSeeder } from './seeders/user.seeder.service';
import { ModuleSeeder } from './seeders/module.seeder.service';
import { LessonSeeder } from './seeders/lesson.seeder.service';
import { ActivitySeeder } from './seeders/activity.seeder.service';
import { LessonActivityAssignmentSeeder } from './seeders/lesson-activity-assignment.seeder.service';
import { Lesson } from '../../../lessons/entities/lesson.entity';
import { Activity } from '../../../activities/entities/activity.entity';
import { LessonActivityAssignment } from '../../../activities/entities/lesson-activity-assignment.entity';
import { Lab } from '../../../labs/entities/lab.entity';
import { LabActivityAssignment } from '../../../activities/entities/lab-activity-assignment.entity';
import { LabSeeder } from './seeders/lab.seeder.service';
import { LabActivityAssignmentSeeder } from './seeders/lab-activity-assignment.seeder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      ModuleEntity,
      Lesson,
      Activity,
      LessonActivityAssignment,
      Lab,
      LabActivityAssignment,
    ]),
  ],
  providers: [
    // seeder services
    UserSeeder,
    ModuleSeeder,
    LessonSeeder,
    ActivitySeeder,
    LessonActivityAssignmentSeeder,
    LabSeeder,
    LabActivityAssignmentSeeder,
    // core service
    SeedsService,
  ],
  exports: [SeedsService],
})
export class SeedsModule {}
