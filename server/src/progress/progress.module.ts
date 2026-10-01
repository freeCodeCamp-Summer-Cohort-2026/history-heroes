import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { UserLessonProgress } from './entities/user-lesson-progress.entity';
import { UserLabProgress } from './entities/user-lab-progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserLessonProgress, UserLabProgress])],
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}
