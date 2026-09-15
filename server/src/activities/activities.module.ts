import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { LessonActivityAssignment } from './entities/lesson-activity-assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, LessonActivityAssignment])],
  exports: [TypeOrmModule],
})
export class ActivitiesModule {}
