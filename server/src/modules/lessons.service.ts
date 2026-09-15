import { Injectable } from '@nestjs/common';
import { Lesson } from './entities/lesson.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonsRepository: Repository<Lesson>,
  ) {}
  /**
   * Returns all lessons and the lessons activities for the given module.
   *
   * Returns in order-index value
   */
  public getModuleLessons(moduleId: string) {
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
