import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from '../modules/entities/lesson.entity';
import { Module as ModuleEntity } from '../modules/entities/module.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonsRepository: Repository<Lesson>,
    @InjectRepository(ModuleEntity)
    private readonly modulesRepository: Repository<ModuleEntity>,
  ) {}

  public async findById(lessonId: string): Promise<Lesson | null> {
    // TODO: update to add populate of the activities once #117 is merged.
    return this.lessonsRepository.findOneBy({ id: lessonId });
  }

  /**
   * Returns all lessons and the lessons activities for the given module.
   *
   * Returns in order-index value
   */
  public async getModuleLessons(moduleId: string): Promise<Lesson[]> {
    // TODO: remove to let the module controller handle this.
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
