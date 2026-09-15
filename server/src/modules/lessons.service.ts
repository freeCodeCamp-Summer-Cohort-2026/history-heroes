import { Injectable, NotFoundException } from '@nestjs/common';
import { Lesson } from './entities/lesson.entity';
import { Module as ModuleEntity } from './entities/module.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonsRepository: Repository<Lesson>,
    @InjectRepository(ModuleEntity)
    private readonly modulesRepository: Repository<ModuleEntity>,
  ) {}

  /**
   * Returns all lessons and the lessons activities for the given module.
   *
   * Returns in order-index value
   */
  public async getModuleLessons(moduleId: string) {
    const module = await this.modulesRepository.findOneBy({ id: moduleId });
    if (!module) {
      throw new NotFoundException(`Module with id "${moduleId}" not found`);
    }

    return this.lessonsRepository.find({
      where: {
        moduleId,
      },
      order: {
        orderIndex: 'ASC',
      },
      // TODO: finalize this once #117 is merged.
    });
  }
}
