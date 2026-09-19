import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { LessonActivityAssignment } from './entities/lesson-activity-assignment.entity';
import { LabActivityAssignment } from './entities/lab-activity-assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, LessonActivityAssignment, LabActivityAssignment])],
  exports: [TypeOrmModule],
})
export class ActivitiesModule {}
