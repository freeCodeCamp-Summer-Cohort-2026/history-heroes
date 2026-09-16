import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import {
  GetLessonResponseDto,
  LessonActivityDto,
} from './dto/get-lesson-response.dto';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get(':lessonId')
  public async getLessonById(
    @Param('lessonId') lessonId: string,
  ): Promise<GetLessonResponseDto> {
    const lesson = await this.lessonsService.findById(lessonId, {
      selectActivities: true,
    });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${lessonId} not found.`);
    }
    return lesson;
  }

  /**
   * Returns the ordered activities assigned to the specified lesson.
   *
   * Note on route duplication:
   * Issue #55 specifies that GET /api/v1/lessons/:lessonId returns the lesson with its activities embedded.
   * However, the client currently fetches activities separately via GET /api/v1/lessons/:lessonId/activities
   * (see client/src/features/lesson/model/api.ts). This endpoint is duplicated here to maintain full
   * backwards-compatibility with the client-side data-fetching layer without breaking or altering the primary
   * lesson-detail contract required by #55.
   */
  @Get(':lessonId/activities')
  public async getLessonActivities(
    @Param('lessonId') lessonId: string,
  ): Promise<LessonActivityDto[]> {
    const lesson = await this.lessonsService.findById(lessonId, {
      selectActivities: true,
    });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${lessonId} not found.`);
    }
    return lesson.activities ?? [];
  }
}
