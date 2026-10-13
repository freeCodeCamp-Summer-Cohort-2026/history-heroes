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
import { UserLabProgress } from './entities/user-lab-progress.entity';

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
   * Records or confirms lesson completion for the active learner via PUT idempotently.
   * Accessible at: PUT /api/v1/progress/lessons/:lessonId
   */
  @Put('lessons/:lessonId')
  async recordLessonProgressPut(
    @Param('lessonId') lessonId: string,
    @Req() req: Request,
  ): Promise<UserLessonProgress> {
    return this.recordLessonProgress(lessonId, req);
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

  /**
   * Records or confirms lab completion for the active learner.
   * Accessible at: POST /api/v1/progress/labs/:labId
   */
  @Post('labs/:labId')
  async recordLabProgress(
    @Param('labId') labId: string,
    @Req() req: Request,
  ): Promise<UserLabProgress> {
    const userId = req.session?.userId;
    const sessionId = req.sessionID;

    return this.progressService.recordLabProgress({
      labId,
      userId,
      sessionId,
    });
  }

  /**
   * Records or confirms lab completion for the active learner via PUT idempotently.
   * Accessible at: PUT /api/v1/progress/labs/:labId
   */
  @Put('labs/:labId')
  async recordLabProgressPut(
    @Param('labId') labId: string,
    @Req() req: Request,
  ): Promise<UserLabProgress> {
    return this.recordLabProgress(labId, req);
  }

  /**
   * Returns progress for a specific lab for the current user/session.
   * Accessible at: GET /api/v1/progress/labs/:labId
   */
  @Get('labs/:labId')
  async getLabProgress(
    @Param('labId') labId: string,
    @Req() req: Request,
  ): Promise<UserLabProgress> {
    const userId = req.session?.userId;
    const sessionId = req.sessionID;

    const progress = await this.progressService.getLabProgress({
      labId,
      userId,
      sessionId,
    });

    if (!progress) {
      throw new NotFoundException(`No progress found for lab "${labId}"`);
    }

    return progress;
  }
}
