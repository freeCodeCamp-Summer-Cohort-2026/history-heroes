import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { Lesson } from '../modules/entities/lesson.entity';
import { LessonsService } from './lessons.service';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get(':lessonId')
  public async getLessonById(
    @Param('lessonId') lessonId: string,
  ): Promise<Lesson> {
    const lesson = await this.lessonsService.findById(lessonId);
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${lessonId} not found.`);
    }
    return lesson;
  }
}
