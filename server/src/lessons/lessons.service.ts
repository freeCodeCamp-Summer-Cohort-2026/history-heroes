import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { Module as ModuleEntity } from '../modules/entities/module.entity';
import { LessonActivityAssignment } from '../activities/entities/lesson-activity-assignment.entity';
import {
  GetLessonResponseDto,
  LessonActivityDto,
} from './dto/get-lesson-response.dto';

export interface FindLessonOptions {
  selectActivities?: boolean;
}

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonsRepository: Repository<Lesson>,
    @InjectRepository(LessonActivityAssignment)
    private readonly assignmentsRepository: Repository<LessonActivityAssignment>,
    @InjectRepository(ModuleEntity)
    private readonly modulesRepository: Repository<ModuleEntity>,
  ) {}

  public async findById(
    lessonId: string,
    options?: FindLessonOptions | boolean,
  ): Promise<GetLessonResponseDto | null> {
    const selectActivities =
      typeof options === 'boolean' ? options : !!options?.selectActivities;

    if (!selectActivities) {
      return this.lessonsRepository.findOneBy({ id: lessonId });
    }

    const [lesson, assignments] = await Promise.all([
      this.lessonsRepository.findOneBy({ id: lessonId }),
      this.assignmentsRepository.find({
        where: { lessonId },
        relations: {
          activity: true,
        },
        order: { orderIndex: 'ASC' },
      }),
    ]);

    if (!lesson) {
      return null;
    }

    const activities: LessonActivityDto[] = assignments.map((assignment) => ({
      ...assignment.activity,
      type: assignment.activity.type,
      activityType: assignment.activity.type,
      orderIndex: assignment.orderIndex,
    }));

    return {
      ...lesson,
      activities,
    };
  }

  /**
   * Returns all lessons and the lessons activities for the given module.
   *
   * Returns in order-index value
   */
  public async getModuleLessons(moduleId: string): Promise<Lesson[]> {
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
    });
  }
}
