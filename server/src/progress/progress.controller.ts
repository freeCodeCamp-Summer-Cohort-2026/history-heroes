import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { ProgressService } from './progress.service';
import { UserLessonProgress } from './entities/user-lesson-progress.entity';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  /**
   * Returns all saved progress for the current user's session and/or authenticated user ID.
   * Can be loaded at: GET /api/v1/progress
   */
  @Get()
  async getProgress(@Req() req: Request): Promise<UserLessonProgress[]> {
    const userId = req.session?.userId;
    const sessionId = req.sessionID;

    return this.progressService.getProgress({ userId, sessionId });
  }

  /**
   * Records or confirms lesson completion for the active learner.
   * Accessible at: POST /api/v1/progress/lessons/:lessonId
   */
  @Post('lessons/:lessonId')
  async recordLessonProgress(
    @Param('lessonId') lessonId: string,
    @Req() req: Request,
  ): Promise<UserLessonProgress> {
    const userId = req.session?.userId;
    const sessionId = req.sessionID;

    return this.progressService.recordLessonProgress({
      lessonId,
      userId,
      sessionId,
    });
  }

  /**
   * Returns progress for a specific lesson for the current user/session.
   * Accessible at: GET /api/v1/progress/lessons/:lessonId
   */
  @Get('lessons/:lessonId')
  async getLessonProgress(
    @Param('lessonId') lessonId: string,
    @Req() req: Request,
  ): Promise<UserLessonProgress> {
    const userId = req.session?.userId;
    const sessionId = req.sessionID;

    const progress = await this.progressService.getLessonProgress({
      lessonId,
      userId,
      sessionId,
    });

    if (!progress) {
      throw new NotFoundException(`No progress found for lesson "${lessonId}"`);
    }

    return progress;
  }
}
