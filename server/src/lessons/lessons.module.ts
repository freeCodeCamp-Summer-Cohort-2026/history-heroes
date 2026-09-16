import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { ActivitiesModule } from '../activities/activities.module';
import { Module as ModuleEntity } from '../modules/entities/module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, ModuleEntity]), ActivitiesModule],
  providers: [LessonsService],
  controllers: [LessonsController],
  exports: [LessonsService],
})
export class LessonsModule {}
