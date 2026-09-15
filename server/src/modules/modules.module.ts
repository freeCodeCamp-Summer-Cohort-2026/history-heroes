import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';
import { Module as ModuleEntity } from './entities/module.entity';
import { Lesson } from './entities/lesson.entity';
import { LessonsService } from './lessons.service';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleEntity, Lesson])],
  controllers: [ModulesController],
  providers: [ModulesService, LessonsService],
  exports: [ModulesService, LessonsService],
})
export class ModulesModule {}
